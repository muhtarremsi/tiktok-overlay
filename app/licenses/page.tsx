export default function LicensesPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans p-8 md:p-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Open Source Lizenzen</h1>
        <p className="text-sm text-zinc-500">Diese Software baut auf der großartigen Arbeit der Open-Source-Community auf.</p>
        
        <div className="space-y-6 text-sm leading-relaxed">
          
          <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-2xl space-y-2">
            <h3 className="text-white font-bold text-lg">TikTok-Live-Connector</h3>
            <p className="text-zinc-500">Copyright (c) 2021 zerodytrash</p>
            <p className="text-xs font-mono text-zinc-400 bg-black p-4 rounded-lg overflow-hidden">
                MIT License<br/><br/>
                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the "Software"), to deal
                in the Software without restriction...
            </p>
          </div>

          <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-2xl space-y-2">
            <h3 className="text-white font-bold text-lg">Lucide Icons</h3>
            <p className="text-zinc-500">Copyright (c) 2023 Lucide Contributors</p>
            <p className="text-xs font-mono text-zinc-400 bg-black p-4 rounded-lg overflow-hidden">
                ISC License
            </p>
          </div>

          <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-2xl space-y-2">
            <h3 className="text-white font-bold text-lg">Next.js & React</h3>
            <p className="text-zinc-500">Copyright (c) Vercel, Inc. / Meta Platforms, Inc.</p>
            <p className="text-xs font-mono text-zinc-400 bg-black p-4 rounded-lg overflow-hidden">
                MIT License
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
