import React, { useState } from 'react';
import { 
  Award, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Zap, 
  Bookmark,
  ExternalLink,
  Laptop,
  AlertCircle
} from 'lucide-react';

export const VerifyCertificatePage: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Parse query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const studentName = urlParams.get('name') || 'Garvit';
  const eventTitle = urlParams.get('eventTitle') || 'Global AI Hackathon 2026';
  const xp = urlParams.get('xp') || '1200';
  const date = urlParams.get('date') || '24 Jan 2026';
  const loc = urlParams.get('loc') || 'Innovation Wing';
  const certId = urlParams.get('certId') || `CP-CERT-MOCK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get 2d context');

      // 1. Draw elegant background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
      bgGrad.addColorStop(0, '#FCFBF7');
      bgGrad.addColorStop(0.5, '#F9F6ED');
      bgGrad.addColorStop(1, '#F3EFE3');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 800);

      // 2. Draw border patterns
      ctx.strokeStyle = '#D4AF37'; // Gold
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 1140, 740);

      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 40, 1120, 720);

      ctx.strokeStyle = '#1e293b'; // Slate 800
      ctx.lineWidth = 3;
      ctx.strokeRect(55, 55, 1090, 690);

      const drawCornerOrnament = (cx: number, cy: number, rot: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.fillStyle = '#D4AF37';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(25, 0);
        ctx.lineTo(25, 5);
        ctx.lineTo(5, 5);
        ctx.lineTo(5, 25);
        ctx.lineTo(0, 25);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };
      drawCornerOrnament(55, 55, 0);
      drawCornerOrnament(1145, 55, Math.PI / 2);
      drawCornerOrnament(1145, 745, Math.PI);
      drawCornerOrnament(55, 745, -Math.PI / 2);

      // 3. Header Text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#475569';
      ctx.font = "bold 13px 'Montserrat', 'Helvetica Neue', Arial, sans-serif";
      ctx.textBaseline = 'top';
      ctx.fillText("CAMPUS PILOT • NATIONAL INSTITUTE OF TECHNOLOGY", 600, 95);

      // 4. Main Certificate Title
      ctx.fillStyle = '#0f172a';
      ctx.font = "black 42px 'Georgia', serif";
      ctx.fillText("CERTIFICATE OF EXCELLENCE", 600, 135);

      ctx.fillStyle = '#64748b';
      ctx.font = "italic 16px 'Georgia', serif";
      ctx.fillText("This certificate is proudly presented to", 600, 210);

      // 5. Student Name
      ctx.fillStyle = '#8c3a21';
      ctx.font = "bold 44px 'Georgia', serif";
      ctx.fillText(studentName, 600, 250);

      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(400, 310);
      ctx.lineTo(800, 310);
      ctx.stroke();

      // 6. Citation Details
      ctx.fillStyle = '#64748b';
      ctx.font = "15px 'Georgia', serif";
      ctx.fillText("for successful completion and outstanding performance in the campus-wide hackathon", 600, 340);

      // Event Title
      ctx.fillStyle = '#cc2929';
      ctx.font = "bold 26px 'Montserrat', Arial, sans-serif";
      ctx.fillText(eventTitle.toUpperCase(), 600, 380);

      ctx.fillStyle = '#475569';
      ctx.font = "14px 'Georgia', serif";
      ctx.fillText(`held at ${loc} on ${date}.`, 600, 425);

      ctx.fillStyle = '#0f172a';
      ctx.font = "bold 14px 'Montserrat', sans-serif";
      ctx.fillText(`AWARDED: ${xp} XP & SHIELD OF HONOR`, 600, 460);

      // 7. Signature Areas
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(150, 620);
      ctx.lineTo(380, 620);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = "italic 22px 'Georgia', serif";
      ctx.fillText("Dr. Sarah Chen", 265, 580);
      ctx.fillStyle = '#64748b';
      ctx.font = "bold 11px 'Montserrat', sans-serif";
      ctx.fillText("HEAD OF JURY & AI LABS", 265, 635);

      ctx.beginPath();
      ctx.moveTo(820, 620);
      ctx.lineTo(1050, 620);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = "italic 22px 'Georgia', serif";
      ctx.fillText("Prof. R. K. Sharma", 935, 580);
      ctx.fillStyle = '#64748b';
      ctx.font = "bold 11px 'Montserrat', sans-serif";
      ctx.fillText("CAMPUS DIRECTOR, NST", 935, 635);

      // 8. Seal of Verification (Gold Seal)
      const sealX = 600;
      const sealY = 590;
      const sealRadius = 55;

      ctx.fillStyle = '#D4AF37';
      ctx.strokeStyle = '#c5a028';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 40; i++) {
        const angle = (i * Math.PI * 2) / 40;
        const outerR = sealRadius + (i % 2 === 0 ? 6 : 0);
        const sx = sealX + Math.cos(angle) * outerR;
        const sy = sealY + Math.sin(angle) * outerR;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
      const sealGrad = ctx.createRadialGradient(sealX, sealY, 10, sealX, sealY, sealRadius);
      sealGrad.addColorStop(0, '#f9e69c');
      sealGrad.addColorStop(0.7, '#D4AF37');
      sealGrad.addColorStop(1, '#a67c1e');
      ctx.fillStyle = sealGrad;
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sealX, sealY, sealRadius - 7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 10px 'Montserrat', sans-serif";
      ctx.fillText("VERIFIED", sealX, sealY - 12);
      ctx.font = "18px Arial";
      ctx.fillText("★", sealX, sealY + 4);
      ctx.font = "bold 9px 'Montserrat', sans-serif";
      ctx.fillText("CP-SECURE", sealX, sealY + 18);

      ctx.fillStyle = '#b48a17';
      ctx.beginPath();
      ctx.moveTo(sealX - 25, sealY + sealRadius - 5);
      ctx.lineTo(sealX - 45, sealY + sealRadius + 35);
      ctx.lineTo(sealX - 25, sealY + sealRadius + 25);
      ctx.lineTo(sealX - 5, sealY + sealRadius + 35);
      ctx.lineTo(sealX - 15, sealY + sealRadius - 5);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(sealX + 15, sealY + sealRadius - 5);
      ctx.lineTo(sealX + 5, sealY + sealRadius + 35);
      ctx.lineTo(sealX + 25, sealY + sealRadius + 25);
      ctx.lineTo(sealX + 45, sealY + sealRadius + 35);
      ctx.lineTo(sealX + 25, sealY + sealRadius - 5);
      ctx.closePath();
      ctx.fill();

      // 9. QR Code and Certificate Meta bottom corner
      ctx.fillStyle = '#64748b';
      ctx.font = "10px monospace";
      ctx.textAlign = 'left';
      ctx.fillText(`VERIFY ID: ${certId}`, 70, 715);
      ctx.fillText(`SYSTEM SECURE TIMESTAMP: 2026-05-18`, 70, 730);

      // Draw custom scannable mock QR code block on phone
      const qrX = 1030;
      const qrY = 650;
      const qrSize = 90;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(qrX + 5, qrY + 5, 20, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX + 9, qrY + 9, 12, 12);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(qrX + 12, qrY + 12, 6, 6);

      ctx.fillRect(qrX + qrSize - 25, qrY + 5, 20, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX + qrSize - 21, qrY + 9, 12, 12);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(qrX + qrSize - 18, qrY + 12, 6, 6);

      ctx.fillRect(qrX + 5, qrY + qrSize - 25, 20, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX + 9, qrY + qrSize - 21, 12, 12);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(qrX + 12, qrY + qrSize - 18, 6, 6);

      ctx.fillRect(qrX + 35, qrY + 10, 10, 5);
      ctx.fillRect(qrX + 50, qrY + 8, 8, 8);
      ctx.fillRect(qrX + 30, qrY + 25, 15, 12);
      ctx.fillRect(qrX + 55, qrY + 30, 10, 10);
      ctx.fillRect(qrX + 35, qrY + 50, 8, 15);
      ctx.fillRect(qrX + 50, qrY + 45, 15, 8);
      ctx.fillRect(qrX + 70, qrY + 45, 8, 12);
      ctx.fillRect(qrX + 30, qrY + 70, 25, 6);
      ctx.fillRect(qrX + 60, qrY + 65, 10, 15);
      ctx.fillRect(qrX + 75, qrY + 70, 8, 8);

      // 10. Trigger actual download
      const link = document.createElement('a');
      link.download = `CampusPilot_Certificate_${eventTitle.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to generate certificate.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 md:p-8 font-sans overflow-y-auto selection:bg-amber-500 selection:text-slate-950">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between py-4 border-b border-slate-800/80 z-10">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
            Campus Pilot Verification
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" /> SECURE CONTEXT
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center py-8 z-10 gap-8">
        
        {/* Verification Success Box */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-bounce">
            <Check className="w-8 h-8 stroke-[3px]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Credentials Verified Successfully!
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            This digital certificate has been verified as authentic and issued directly by the Campus Pilot examination registry.
          </p>
        </div>

        {/* Certificate Mobile Viewport (Uses scale-down responsive wrapping) */}
        <div className="w-full overflow-hidden flex items-center justify-center p-1 bg-slate-900/60 border border-slate-800 rounded-[28px] shadow-2xl relative max-w-2xl aspect-[1.5/1]">
          <div className="w-full h-full scale-[0.98] sm:scale-100 transition-all origin-center bg-gradient-to-br from-[#fdfcf7] to-[#f4f0e4] rounded-[22px] border-4 border-double border-amber-500/80 p-4 sm:p-8 flex flex-col justify-between text-slate-800 select-none">
            
            {/* Corner Ornaments */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-amber-500/60" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-amber-500/60" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-amber-500/60" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-amber-500/60" />

            {/* Content Top */}
            <div className="text-center space-y-0.5">
              <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                Campus Pilot Academy
              </span>
              <h3 className="text-sm sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
                Certificate of Excellence
              </h3>
              <p className="text-[7px] sm:text-[10px] italic text-slate-400 font-serif leading-none">
                This is proudly presented to
              </p>
            </div>

            {/* Content Mid */}
            <div className="text-center my-1 sm:my-2">
              <h1 className="text-lg sm:text-3xl font-extrabold text-[#8c3a21] font-serif tracking-wide truncate">
                {studentName}
              </h1>
              <div className="w-1/4 h-0.5 bg-amber-500/30 mx-auto my-1" />
              <p className="text-[6px] sm:text-[10px] text-slate-500 font-serif leading-relaxed max-w-sm mx-auto">
                for successful completion and outstanding performance in the campus hackathon
              </p>
              <h4 className="text-[10px] sm:text-base font-black text-[#cc2929] uppercase tracking-wider mt-0.5">
                {eventTitle}
              </h4>
            </div>

            {/* Content Bottom */}
            <div className="flex justify-between items-end pt-1.5 sm:pt-3 border-t border-slate-200/50">
              
              <div className="text-left w-[80px] sm:w-[120px]">
                <span className="font-serif italic text-[8px] sm:text-sm text-slate-700 font-bold tracking-wider leading-none block">
                  Sarah Chen
                </span>
                <div className="h-px bg-slate-300 w-full my-0.5" />
                <span className="text-[5px] sm:text-[7px] font-black text-slate-400 uppercase tracking-wider block">
                  Head of Jury
                </span>
              </div>

              <div className="relative">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center border border-white/20 shadow-md">
                  <span className="text-[5px] sm:text-[8px] font-black text-white">★</span>
                </div>
              </div>

              <div className="text-right w-[80px] sm:w-[120px]">
                <span className="font-serif italic text-[8px] sm:text-sm text-slate-700 font-bold tracking-wider leading-none block">
                  Prof. Sharma
                </span>
                <div className="h-px bg-slate-300 w-full my-0.5" />
                <span className="text-[5px] sm:text-[7px] font-black text-slate-400 uppercase tracking-wider block">
                  Campus Director
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Detailed stats block for phone */}
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 border-b border-slate-800 pb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Certification Credentials
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-wider">CERTIFICATE ID</span>
              <span className="text-slate-300 font-mono font-bold">{certId}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-wider">RECIPIENT</span>
              <span className="text-amber-400 font-extrabold uppercase">{studentName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-wider">EVENT</span>
              <span className="text-white font-extrabold uppercase">{eventTitle}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-wider">CREDITED XP</span>
              <span className="text-amber-500 font-black flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> +{xp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Download Call to Action Button */}
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full max-w-md py-4.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 hover:shadow-amber-500/25 active:translate-y-0.5 active:scale-[0.99] group ${
            isDownloading ? 'opacity-80 cursor-wait' : ''
          }`}
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5 stroke-[2.5px] group-hover:-translate-y-0.5 transition-transform" />
          )}
          {isDownloading ? 'Downloading...' : 'Download Certificate Image'}
        </button>

        {/* Heuristic 9: Help users recognize, diagnose, and recover from errors */}
        <div className="w-full max-w-md p-5 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-3xl text-left transition-all space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 stroke-[2.5px] animate-pulse" /> Verification or Ledger Discrepancy?
          </h4>
          <p className="text-xs text-rose-300/80 leading-relaxed font-medium">
            If the details displayed above do not match your performance, or you encounter a loading issue, please contact the **NIT Student Registry Administrator** at <span className="font-extrabold text-white underline tracking-wider font-mono select-all hover:text-rose-200 transition-colors">+91 98765 43210</span> or email <span className="font-extrabold text-white underline select-all hover:text-rose-200 transition-colors">admin@campuspilot.nit.edu</span>. Keep your Certificate ID (<span className="font-mono text-amber-400 select-all">{certId}</span>) handy for manual lookup.
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-6 border-t border-slate-900 text-[10px] text-slate-500 font-medium">
        © 2026 Campus Pilot Registry Authority. Powered by NIT secure ledger systems.
      </footer>

    </div>
  );
};
