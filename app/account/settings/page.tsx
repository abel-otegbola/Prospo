'use client';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContextValue";
import { useModal } from "../../../contexts/useModal";
import Button from "../../../components/button/Button";
import LoadingIcon from "../../../assets/icons/loadingIcon";
import { TrashBin2 } from "@solar-icons/react";
import Input from "../../../components/input/Input";
import ThemeSelector from "../../../components/themeSelector/themeSelector";
import { UserProfileContext } from "../../../contexts/UserProfileContextValue";
import type { UserPlan } from "../../../interface/userProfile";
import { useRouter } from "next/navigation";

type Section = "appearance" | "billing" | "security" | "danger";

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: "appearance", label: "Appearance" },
  { id: "billing", label: "Billing" },
  { id: "security", label: "Security" },
  { id: "danger", label: "Danger Zone" },
];

const PLAN_OPTIONS: Array<{ id: UserPlan; label: string; price: string; cadence: string }> = [
  { id: "free", label: "Free", price: "$0", cadence: "Forever free" },
  { id: "pro", label: "Pro", price: "$9", cadence: "Per month" },
  { id: "enterprise", label: "Enterprise", price: "$25", cadence: "Per month" },
  { id: "lifetime", label: "Lifetime", price: "$39", cadence: "One-time" },
];

export default function Settings() {
  const { user, updateUser, deleteAccount, loading } = useContext(AuthContext);
  const { profile } = useContext(UserProfileContext);
  const { showModal } = useModal();
  const navigate = useRouter();
  const [activeSection, setActiveSection] = useState<Section>("appearance");

  // Security form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  // Danger zone
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [billingBusyPlan, setBillingBusyPlan] = useState<UserPlan | null>(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  const currentPlan = profile?.current_plan || "free";

  useEffect(() => {
    const finishCheckout = async () => {
      if (!user?.uid || !user?.email) {
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const sessionId =
        params.get("dodo_session_id") || params.get("checkout_id") || params.get("session_id") || "";
      const targetPlan = (params.get("target_plan") || "") as UserPlan;

      if (!sessionId || !targetPlan || processingCheckout) {
        return;
      }

      setProcessingCheckout(true);
      try {
        const response = await fetch("/api/dodo/confirm-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            targetPlan,
          }),
        });

        const result = await response.json();
        if (!response.ok || !result.verified) {
          throw new Error(result.error || "Payment was not verified.");
        }

        await updateUser({ current_plan: targetPlan });
        await showModal({
          title: "Plan Updated",
          message: `Your subscription is now on the ${targetPlan} plan.`,
        });

        navigate.push("/account/settings");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to verify payment.";
        await showModal({ title: "Payment Verification Failed", message });
      } finally {
        setProcessingCheckout(false);
      }
    };

    finishCheckout();
  }, [navigate, processingCheckout, showModal, updateUser, user?.email, user?.uid]);

  const handlePlanChange = async (targetPlan: UserPlan) => {
    if (!user?.uid || !user?.email) {
      await showModal({ title: "Not Logged In", message: "Please log in before changing your plan." });
      return;
    }

    if (targetPlan === currentPlan) {
      await showModal({ title: "Current Plan", message: `You are already on the ${targetPlan} plan.` });
      return;
    }

    if (targetPlan === "free") {
      const confirmed = await showModal({
        title: "Downgrade to Free",
        message: "This moves your account to the Free plan immediately.",
        showCancel: true,
      });

      if (!confirmed) {
        return;
      }

      setBillingBusyPlan(targetPlan);
      try {
        await updateUser({ current_plan: "free" });
        await showModal({ title: "Plan Updated", message: "Your account is now on the Free plan." });
      } finally {
        setBillingBusyPlan(null);
      }
      return;
    }

    setBillingBusyPlan(targetPlan);
    try {
      const response = await fetch("/api/dodo/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          targetPlan,
          currentPlan,
          origin: window.location.origin,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.checkoutUrl) {
        throw new Error(result.error || "Unable to create checkout session.");
      }

      navigate.push(result.checkoutUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start checkout.";
      await showModal({ title: "Checkout Error", message });
      setBillingBusyPlan(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      await showModal({ title: "Mismatch", message: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      await showModal({ title: "Too Short", message: "Password must be at least 6 characters." });
      return;
    }
    setSavingPassword(true);
    try {
      await updateUser({ password: newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await showModal({ title: "Success", message: "Password updated successfully." });
    } catch {
      // error handled by AuthContext toast
    } finally {
      setSavingPassword(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || newEmail === user?.email) {
      await showModal({ title: "No Change", message: "Please enter a different email address." });
      return;
    }
    setSavingEmail(true);
    try {
      await updateUser({ email: newEmail });
      setNewEmail("");
      await showModal({ title: "Success", message: "Email updated successfully." });
    } catch {
      // error handled by AuthContext toast
    } finally {
      setSavingEmail(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmed = await showModal({
      title: "Delete Account",
      message: "This will permanently delete your account, all your leads, and profile data.\n\nThis action cannot be undone. Are you absolutely sure?",
      showCancel: true,
    });
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteAccount(deletePassword);
      navigate.push("/");
    } catch {
      // error handled by AuthContext toast
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-2">Settings</h1>
        <p className="opacity-[0.6] ">Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:p-6 rounded-lg md:border border-gray/[0.1] md:bg-gray/[0.03] min-h-[500px]">
        {/* Sidebar nav */}
        <nav className="lg:w-64 flex lg:flex-col flex-row gap-1 shrink-0">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`text-left px-3 py-2 rounded-lg  font-medium transition-colors ${
                activeSection === item.id
                  ? "bg-background text-text border border-gray/[0.2]"
                  : "opacity-[0.6] hover:bg-gray/[0.08]"
              } ${item.id === "danger" ? "text-red-600" : ""} ${
                activeSection === "danger" && item.id === "danger" ? "!bg-red-600 text-white" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1">
          {/* Appearance */}
          {activeSection === "appearance" && (
            <div className="bg-background border border-gray/[0.2] rounded-xl p-6 flex flex-col gap-6">
              <div>
                <h2 className="font-semibold mb-1">Theme</h2>
                <p className=" opacity-[0.6] mb-4">Choose how Prospo looks for you</p>
                <ThemeSelector />
              </div>
            </div>
          )}

          {activeSection === "billing" && (
            <div className="bg-background border border-gray/[0.2] rounded-xl p-6 flex flex-col gap-5">
              <div>
                <h2 className="font-semibold mb-1">Subscription Plan</h2>
                <p className="opacity-[0.6] mb-1">Current plan: <span className="font-medium capitalize">{currentPlan}</span></p>
                <p className="opacity-[0.6] text-sm">Paid plans require Dodo checkout confirmation before we apply the plan change.</p>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {PLAN_OPTIONS.map((plan) => {
                  const isCurrent = currentPlan === plan.id;
                  const isLoadingPlan = billingBusyPlan === plan.id;

                  return (
                    <div
                      key={plan.id}
                      className={`rounded-xl border p-4 flex flex-col gap-3 ${isCurrent ? "border-primary bg-primary/5" : "border-gray/[0.2]"}`}
                    >
                      <div>
                        <h3 className="font-semibold capitalize">{plan.label}</h3>
                        <p className="text-lg font-medium">{plan.price}</p>
                        <p className="text-xs opacity-[0.6]">{plan.cadence}</p>
                      </div>

                      <Button
                        type="button"
                        variant={isCurrent ? "secondary" : "primary"}
                        disabled={isCurrent || !!billingBusyPlan || processingCheckout}
                        onClick={() => handlePlanChange(plan.id)}
                        className="w-full justify-center"
                      >
                        {isCurrent ? "Current Plan" : isLoadingPlan ? "Opening checkout..." : "Switch Plan"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <div className="flex flex-col gap-4">
              {/* Change email */}
              <div className="bg-background border border-gray/[0.2] rounded-xl p-6">
                <h2 className="font-semibold mb-1 flex items-center gap-2">
                  Change Email
                </h2>
                <p className=" opacity-[0.6] mb-4">Current: <span className="font-medium">{user?.email}</span></p>
                <form onSubmit={handleChangeEmail} className="flex flex-col gap-3 max-w-sm">
                  <Input
                    type="email"
                    placeholder="New email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={savingEmail || loading} className="w-fit">
                    {savingEmail ? <><LoadingIcon /> Saving...</> : "Update Email"}
                  </Button>
                </form>
              </div>

              {/* Change password */}
              <div className="bg-background border border-gray/[0.2] rounded-xl p-6">
                <h2 className="font-semibold mb-1 flex items-center gap-2">
                  Change Password
                </h2>
                <p className=" opacity-[0.6] mb-4">Choose a strong password with at least 6 characters</p>
                <form onSubmit={handleChangePassword} className="flex flex-col gap-3 max-w-sm">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={savingPassword || loading} className="w-fit">
                    {savingPassword ? <><LoadingIcon /> Saving...</> : "Update Password"}
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeSection === "danger" && (
            <div className="bg-background border border-gray/[0.2] rounded-xl p-6">
              <h2 className="font-semibold text-red-600 mb-1 flex items-center gap-2">
                <TrashBin2 size={18} /> Delete Account
              </h2>
              <p className=" opacity-[0.6] mb-4">
                Permanently delete your account and all associated data including leads and profile. This action
                <span className="font-semibold text-red-600"> cannot be undone</span>.
              </p>
              <form onSubmit={handleDeleteAccount} className="flex flex-col gap-3">
                <Input
                  type="password"
                  placeholder="Enter your password to confirm"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={deleting || !deletePassword}
                  className="w-fit px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg  font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deleting ? <><LoadingIcon /> Deleting...</> : <><TrashBin2 size={16} /> Delete My Account</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
