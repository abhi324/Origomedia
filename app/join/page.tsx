import Navbar from "@/components/Navbar";
import JoinForm from "@/components/JoinForm";

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-origo-beige">
      <Navbar />
      
      <div className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-start">
          
          {/* Header Section */}
          <div className="w-full md:w-1/2">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-origo-dark/40 mb-6 block">
              Step into the Origin
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-origo-dark mb-10 leading-[1.1]">
              Scale your impact <br />
              <span className="italic">exponentially.</span>
            </h1>
            
            <p className="text-xl text-origo-dark/70 leading-relaxed mb-12 max-w-lg">
              We don't just find sponsors. We architect long-term trajectories for creators who are ready to own their influence.
            </p>
            
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full border border-origo-dark/10 flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-origo-dark mb-2">Vetted Ecosystem</h4>
                  <p className="text-sm text-origo-dark/60">Connect with premium brands that actually match your niche and aesthetic.</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full border border-origo-dark/10 flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-origo-dark mb-2">Growth Analytics</h4>
                  <p className="text-sm text-origo-dark/60">Access proprietary data to see how your campaigns truly drive brand value.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 bg-white/40 backdrop-blur-3xl rounded-3xl p-8 md:p-12 border border-origo-dark/5 shadow-2xl">
            <JoinForm />
          </div>

        </div>
      </div>

      <footer className="py-12 bg-origo-beige border-t border-origo-dark/5 text-center text-xs tracking-widest text-origo-dark/30">
        © 2026 ORIGO MEDIA. ALL RIGHTS RESERVED.
      </footer>
    </main>
  );
}
