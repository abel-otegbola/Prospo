import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { CaseStudyBlock, CaseStudyDocument, CaseStudyPayload } from "../interface/caseStudy";
import { assertUserWithinPlanLimit, incrementUserUsage } from "./profileUsage";

const CASE_STUDIES_COLLECTION = "caseStudies";

function sanitizeBlocks(blocks: CaseStudyBlock[]): CaseStudyBlock[] {
  return blocks.map((block) => ({
    ...block,
    content: (block.content || "").trim(),
  }));
}

function sanitizePayload(payload: CaseStudyPayload): CaseStudyPayload {
  return {
    title: payload.title.trim() || "Untitled Case Study",
    blocks: sanitizeBlocks(payload.blocks),
  };
}

async function assertCaseStudyOwnership(caseStudyId: string, userId: string): Promise<void> {
  const ref = doc(db, CASE_STUDIES_COLLECTION, caseStudyId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Case study not found");
  }

  const data = snapshot.data();
  if (data.userId !== userId) {
    throw new Error("Unauthorized case study access");
  }
}

export async function saveCaseStudyDraft(
  userId: string,
  payload: CaseStudyPayload,
  caseStudyId?: string,
): Promise<string> {
  const clean = sanitizePayload(payload);

  if (!caseStudyId) {
    await assertUserWithinPlanLimit(userId, "case_studies");

    const created = await addDoc(collection(db, CASE_STUDIES_COLLECTION), {
      userId,
      ...clean,
      status: "draft",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: null,
    });

    try {
      await incrementUserUsage(userId, "case_studies");
    } catch (usageError) {
      console.error("Failed to update case study usage counter:", usageError);
    }

    return created.id;
  }

  await assertCaseStudyOwnership(caseStudyId, userId);
  await updateDoc(doc(db, CASE_STUDIES_COLLECTION, caseStudyId), {
    ...clean,
    status: "draft",
    updatedAt: serverTimestamp(),
  });

  return caseStudyId;
}

export async function publishCaseStudy(
  userId: string,
  payload: CaseStudyPayload,
  caseStudyId?: string,
): Promise<string> {
  const clean = sanitizePayload(payload);

  if (!caseStudyId) {
    await assertUserWithinPlanLimit(userId, "case_studies");

    const created = await addDoc(collection(db, CASE_STUDIES_COLLECTION), {
      userId,
      ...clean,
      status: "published",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: serverTimestamp(),
    });

    try {
      await incrementUserUsage(userId, "case_studies");
    } catch (usageError) {
      console.error("Failed to update case study usage counter:", usageError);
    }

    return created.id;
  }

  await assertCaseStudyOwnership(caseStudyId, userId);
  await updateDoc(doc(db, CASE_STUDIES_COLLECTION, caseStudyId), {
    ...clean,
    status: "published",
    updatedAt: serverTimestamp(),
    publishedAt: serverTimestamp(),
  });

  return caseStudyId;
}

export async function getUserCaseStudies(userId: string): Promise<CaseStudyDocument[]> {
  const studiesQuery = query(collection(db, CASE_STUDIES_COLLECTION), where("userId", "==", userId));
  const snapshot = await getDocs(studiesQuery);

  const docs = snapshot.docs.map((entry) => {
    const data = entry.data();
    return {
      id: entry.id,
      userId: data.userId,
      title: data.title || "Untitled Case Study",
      blocks: Array.isArray(data.blocks) ? data.blocks : [],
      status: data.status === "published" ? "published" : "draft",
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      publishedAt: data.publishedAt,
    } as CaseStudyDocument;
  });

  const toMillis = (value: unknown): number => {
    if (value && typeof value === "object" && "toMillis" in (value as object)) {
      try {
        return (value as { toMillis: () => number }).toMillis();
      } catch {
        return 0;
      }
    }
    return 0;
  };

  return docs.sort((a, b) => toMillis(b.updatedAt) - toMillis(a.updatedAt));
}

export async function getUserCaseStudyById(userId: string, caseStudyId: string): Promise<CaseStudyDocument> {
  const ref = doc(db, CASE_STUDIES_COLLECTION, caseStudyId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Case study not found");
  }

  const data = snapshot.data();
  if (data.userId !== userId) {
    throw new Error("Unauthorized case study access");
  }

  return {
    id: snapshot.id,
    userId: data.userId,
    title: data.title || "Untitled Case Study",
    blocks: Array.isArray(data.blocks) ? data.blocks : [],
    status: data.status === "published" ? "published" : "draft",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    publishedAt: data.publishedAt,
  } as CaseStudyDocument;
}

export async function getPublicCaseStudyById(caseStudyId: string): Promise<CaseStudyDocument> {
  const ref = doc(db, CASE_STUDIES_COLLECTION, caseStudyId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Case study not found");
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    userId: data.userId,
    title: data.title || "Untitled Case Study",
    blocks: Array.isArray(data.blocks) ? data.blocks : [],
    status: data.status === "published" ? "published" : "draft",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    publishedAt: data.publishedAt,
  } as CaseStudyDocument;
}
