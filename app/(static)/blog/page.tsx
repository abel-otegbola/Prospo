import Topbar from "../../../components/topbar/topbar";
import Footer from "../../../components/footer/Footer";
import Link from "next/link";

function Blog() {
  const featured = {
    title: "10 Proven Strategies to 10x Your Lead Generation in 2025",
    excerpt: "Discover the cutting-edge tactics that top sales teams are using to dominate their markets and generate more qualified leads than ever before.",
    author: "Sarah Chen",
    date: "Nov 15, 2025",
    readTime: "8 min read",
    category: "Lead Generation",
    image: "📈"
  };

  const posts = [
    {
      title: "The Ultimate Guide to Cold Email Outreach",
      excerpt: "Learn how to craft compelling cold emails that get responses and convert prospects into customers.",
      author: "Michael Rodriguez",
      date: "Nov 10, 2025",
      readTime: "6 min read",
      category: "Email Marketing",
      image: "✉️"
    },
    {
      title: "How AI is Transforming Sales in 2025",
      excerpt: "Explore how artificial intelligence is revolutionizing the way businesses find, qualify, and close deals.",
      author: "Emily Watson",
      date: "Nov 8, 2025",
      readTime: "5 min read",
      category: "Technology",
      image: "🤖"
    },
    {
      title: "Building a High-Performing Sales Team",
      excerpt: "A comprehensive guide to recruiting, training, and managing a sales team that consistently exceeds targets.",
      author: "David Kim",
      date: "Nov 5, 2025",
      readTime: "10 min read",
      category: "Sales Management",
      image: "👥"
    },
    {
      title: "LinkedIn Lead Generation: Advanced Tactics",
      excerpt: "Master LinkedIn's platform to generate high-quality B2B leads and build meaningful business relationships.",
      author: "Lisa Anderson",
      date: "Nov 1, 2025",
      readTime: "7 min read",
      category: "Social Selling",
      image: "💼"
    },
    {
      title: "Converting Leads into Paying Customers",
      excerpt: "Proven strategies and frameworks for moving prospects through your sales funnel efficiently.",
      author: "James Thompson",
      date: "Oct 28, 2025",
      readTime: "9 min read",
      category: "Sales Strategy",
      image: "💰"
    },
    {
      title: "The Power of Personalization in Sales",
      excerpt: "Why generic outreach doesn't work anymore and how to personalize at scale with modern tools.",
      author: "Sarah Chen",
      date: "Oct 25, 2025",
      readTime: "6 min read",
      category: "Personalization",
      image: "🎯"
    }
  ];

  const categories = ["All", "Lead Generation", "Email Marketing", "Sales Strategy", "Technology", "Social Selling", "Personalization"];

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            The Prospo Blog
          </h1>
          <p className="text-lg opacity-[0.6] dark:text-gray/">
            Insights, strategies, and stories from the world of modern sales and lead generation
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto pb-12">
        <div className="bg-gradient-to-r from-primary/10 to-fuchsia-500/10 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-primary text-white rounded-full text-sm font-medium mb-4">
                Featured
              </div>
              <h2 className="text-3xl font-bold mb-4">{featured.title}</h2>
              <p className="opacity-[0.6] dark:text-gray-300 mb-6">{featured.excerpt}</p>
              <div className="flex items-center gap-4 mb-6 text-sm opacity-[0.6] dark:text-gray/">
                <span>{featured.author}</span>
                <span>•</span>
                <span>{featured.date}</span>
                <span>•</span>
                <span>{featured.readTime}</span>
              </div>
              <Link
                href="/blog/lead-generation-strategies"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all"
              >
                Read Article
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-9xl">{featured.image}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary transition-all text-sm font-medium"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto pb-20">
        <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={index}
              className="group bg-background  rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 h-48 flex items-center justify-center text-6xl">
                {post.image}
              </div>
              <div className="p-6">
                <div className="text-xs font-medium text-primary mb-3">{post.category}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="opacity-[0.6] dark:text-gray/ text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs opacity-[0.6] dark:opacity-[0.6]">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href={`/blog/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="text-primary font-medium text-sm hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto pb-20">
        <div className="bg-gradient-to-r from-primary to-fuchsia-500 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-lg mb-8 opacity-90">
            Get the latest sales strategies, lead generation tips, and industry insights delivered to your inbox weekly
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 outline-none"
            />
            <button className="bg-background text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Blog;
