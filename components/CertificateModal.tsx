import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Award, 
  QrCode, 
  Download, 
  Sparkles, 
  Check, 
  Printer, 
  ShieldCheck,
  Calendar,
  Zap,
  Bookmark,
  Share2,
  AlertCircle
} from 'lucide-react';
import { CampusEvent } from './EventsPage';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CampusEvent;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, event }) => {
  const [studentName, setStudentName] = useState('Garvit');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [certId, setCertId] = useState('');

  // Generate a persistent mock certificate ID on mount/event change
  useEffect(() => {
    if (event) {
      const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
      const code = `CP-CERT-${event.id.substring(0, 5).toUpperCase()}-${randomPart}`;
      setCertId(code);
    }
  }, [event]);

  // Lock body scroll when the modal is open to keep the background page physically fixed (no background scrolling)
  useEffect(() => {
    if (isOpen) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen || !event) return null;

  // Verification URL for QR Code. Uses local Wi-Fi network IP fallback so it really works when scanned from a phone.
  const getVerificationUrl = () => {
    if (!event) return '';
    let base = window.location.origin;
    if (base.includes('localhost') || base.includes('127.0.0.1')) {
      base = 'http://10.7.25.168:5173';
    }
    return `${base}/?verify=true&name=${encodeURIComponent(studentName)}&eventId=${event.id}&certId=${certId}&eventTitle=${encodeURIComponent(event.title)}&xp=${event.xp || '1200'}&date=${encodeURIComponent(event.date || 'Campus Hub')}&loc=${encodeURIComponent(event.location || 'Innovation Wing')}`;
  };
  const verificationUrl = getVerificationUrl();
  const qrCodeUrl = event ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verificationUrl)}&color=0f172a&bgcolor=ffffff` : '';

  // Draw and download the certificate using Canvas
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
      // Outer Gold Double Border
      ctx.strokeStyle = '#D4AF37'; // Gold
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 1140, 740);

      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 40, 1120, 720);

      // Inner Slate Border
      ctx.strokeStyle = '#1e293b'; // Slate 800
      ctx.lineWidth = 3;
      ctx.strokeRect(55, 55, 1090, 690);

      // Corner Ornaments
      const drawCornerOrnament = (cx: number, cy: number, rot: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.fillStyle = '#D4AF37';
        ctx.beginPath();
        // Classical leaf shape/triangular ornament
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
      ctx.fillStyle = '#475569'; // Slate 600
      ctx.font = "bold 13px 'Montserrat', 'Helvetica Neue', Arial, sans-serif";
      ctx.textBaseline = 'top';
      ctx.fillText("CAMPUS PILOT • NATIONAL INSTITUTE OF TECHNOLOGY", 600, 95);

      // 4. Main Certificate Title
      ctx.fillStyle = '#0f172a'; // Slate 900
      ctx.font = "black 42px 'Georgia', serif";
      ctx.fillText("CERTIFICATE OF EXCELLENCE", 600, 135);

      ctx.fillStyle = '#64748b'; // Slate 500
      ctx.font = "italic 16px 'Georgia', serif";
      ctx.fillText("This certificate is proudly presented to", 600, 210);

      // 5. Student Name (Dynamic)
      ctx.fillStyle = '#8c3a21'; // Warm premium accent
      ctx.font = "bold 44px 'Georgia', serif";
      ctx.fillText(studentName, 600, 250);

      // Underline name beautifully
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(400, 310);
      ctx.lineTo(800, 310);
      ctx.stroke();

      // 6. Citation Details
      ctx.fillStyle = '#64748b'; // Slate 500
      ctx.font = "15px 'Georgia', serif";
      ctx.fillText("for successful completion and outstanding performance in the campus-wide hackathon", 600, 340);

      // Event Title
      ctx.fillStyle = '#cc2929'; // Red accent
      ctx.font = "bold 26px 'Montserrat', Arial, sans-serif";
      ctx.fillText(event.title.toUpperCase(), 600, 380);

      ctx.fillStyle = '#475569'; // Slate 600
      ctx.font = "14px 'Georgia', serif";
      ctx.fillText(`held at ${event.location || 'Innovation Wing'} on ${event.date || 'Campus Hub'}.`, 600, 425);

      ctx.fillStyle = '#0f172a';
      ctx.font = "bold 14px 'Montserrat', sans-serif";
      ctx.fillText(`AWARDED: ${event.xp} XP & SHIELD OF HONOR`, 600, 460);

      // 7. Signature Areas
      // Left Signature (Lead Judge / Organizer)
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

      // Right Signature (Campus Director)
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

      // Draw spiked wheel background
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

      // Outer solid circle of seal
      ctx.beginPath();
      ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
      const sealGrad = ctx.createRadialGradient(sealX, sealY, 10, sealX, sealY, sealRadius);
      sealGrad.addColorStop(0, '#f9e69c');
      sealGrad.addColorStop(0.7, '#D4AF37');
      sealGrad.addColorStop(1, '#a67c1e');
      ctx.fillStyle = sealGrad;
      ctx.fill();

      // Inner golden line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sealX, sealY, sealRadius - 7, 0, Math.PI * 2);
      ctx.stroke();

      // Seal Star / Ribbon Details
      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 10px 'Montserrat', sans-serif";
      ctx.fillText("VERIFIED", sealX, sealY - 12);
      ctx.font = "18px Arial";
      ctx.fillText("★", sealX, sealY + 4);
      ctx.font = "bold 9px 'Montserrat', sans-serif";
      ctx.fillText("CP-SECURE", sealX, sealY + 18);

      // Ribbon tails
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

      // Draw standard scannable mock QR code block in lower right corner
      // We will first try to load the QR code image from the API
      // If it takes longer than 900ms, we fall back to a beautifully drawn mock vector QR
      // so the canvas download never crashes/hangs.
      const loadQRImage = (): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = qrCodeUrl;
          img.onload = () => resolve(img);
          img.onerror = () => reject();
          setTimeout(() => reject(), 900); // 900ms timeout
        });
      };

      try {
        const qrImage = await loadQRImage();
        ctx.drawImage(qrImage, 1030, 650, 90, 90);
        // Draw a neat gold frame around QR
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.strokeRect(1028, 648, 94, 94);
      } catch {
        // Fallback Vector QR Design on Canvas
        const qrX = 1030;
        const qrY = 650;
        const qrSize = 90;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrX, qrY, qrSize, qrSize);
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.strokeRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4);

        ctx.fillStyle = '#0f172a';
        // Render stylized square markers to represent a scannable QR Code
        // Top Left Marker
        ctx.fillRect(qrX + 5, qrY + 5, 20, 20);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrX + 9, qrY + 9, 12, 12);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(qrX + 12, qrY + 12, 6, 6);

        // Top Right Marker
        ctx.fillRect(qrX + qrSize - 25, qrY + 5, 20, 20);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrX + qrSize - 21, qrY + 9, 12, 12);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(qrX + qrSize - 18, qrY + 12, 6, 6);

        // Bottom Left Marker
        ctx.fillRect(qrX + 5, qrY + qrSize - 25, 20, 20);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrX + 9, qrY + qrSize - 21, 12, 12);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(qrX + 12, qrY + qrSize - 18, 6, 6);

        // Scattered data blocks
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
      }

      // 10. Trigger actual download
      const link = document.createElement('a');
      link.download = `CampusPilot_Certificate_${event.title.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to generate high-resolution certificate image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(verificationUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500">
      
      {/* Premium Light Frosted Glassmorphic Vault Card */}
      <div className="bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[36px] w-full max-w-sm overflow-hidden flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.16),0_10px_35px_rgba(0,0,0,0.04)] scale-100 animate-in zoom-in-95 duration-500 p-6 relative cubic-bezier-spring">
        
        {/* Soft glowing ambient spots */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Header Block with Slow Spinning Gold Badge */}
        <div className="flex justify-between items-center mb-5 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/25 rounded-2xl flex items-center justify-center text-amber-600 shadow-md shadow-amber-500/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
              <Award className="w-5 h-5 text-amber-500 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.25em] block leading-none mb-1">
                SECURE GATEWAY v4.2
              </span>
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider leading-none">
                Verify Credentials
              </h4>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center bg-slate-50/80 border border-slate-200/60 text-slate-500 hover:text-slate-800 hover:border-slate-300 rounded-full transition-all hover:scale-105 active:scale-95"
            title="Close Gate"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recipient Customizer Console input */}
        <div className="mb-5 bg-slate-50/80 border border-slate-100 focus-within:border-amber-500/40 focus-within:bg-white rounded-2xl p-3 flex flex-col gap-1 transition-all z-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.015)]">
          <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            CREDENTIAL RECIPIENT NAME
          </span>
          <input 
            type="text" 
            value={studentName}
            onChange={(e) => setStudentName(e.target.value.substring(0, 30))}
            className="bg-transparent text-slate-800 font-extrabold text-sm focus:outline-none w-full border-b border-transparent placeholder:text-slate-300 text-amber-600 py-0.5"
            placeholder="Type recipient name..."
          />
        </div>

        {/* QR Code target scope frame with glowing laser sweeps */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 z-10">
          
          <div className="relative group p-4 bg-slate-50/60 rounded-[28px] border border-slate-100 shadow-[inset_0_2px_8px_rgba(0,0,0,0.02)] w-56 h-56 flex items-center justify-center overflow-hidden">
            
            {/* Cyberpunk corner scope targets */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-500/50 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-500/50 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-500/50 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-500/50 rounded-br-lg" />

            {/* Glowing neon laser line sweep animation */}
            <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent z-25 shadow-[0_0_8px_#f59e0b,0_0_15px_#f59e0b] animate-laser-sweep" />
            {/* Translucent neon golden scanning wave */}
            <div className="absolute left-4 right-4 top-4 bg-gradient-to-b from-amber-500/8 to-transparent z-10 origin-top animate-laser-trail rounded-b-lg" />

            {/* Pulsing QR Code */}
            <div className="relative bg-white p-3 rounded-2xl border border-slate-100 w-44 h-44 flex items-center justify-center overflow-hidden z-20 group-hover:scale-[1.02] transition duration-500 shadow-sm">
              <img 
                src={qrCodeUrl} 
                alt="Secure Claim QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div>
            <h4 className="text-slate-700 font-extrabold text-sm flex items-center justify-center gap-1.5 uppercase tracking-wide">
              <QrCode className="w-4 h-4 text-amber-500 animate-pulse" /> SCAN HOLOGRAPH
            </h4>
            <p className="text-slate-400 text-[10px] mt-1 max-w-[240px] mx-auto leading-normal">
              Scan this dynamic QR code using a smartphone to claim, view, and verify credentials instantly.
            </p>
          </div>
          
          {/* Metadata Terminal Tags */}
          <div className="w-full bg-slate-50/60 border border-slate-100 rounded-2xl p-3.5 text-left space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400 font-bold uppercase tracking-wider">CERT ID</span>
              <span className="text-slate-600 font-mono font-bold truncate max-w-[150px]">{certId}</span>
            </div>
            <div className="flex justify-between text-[10px] items-center">
              <span className="text-slate-400 font-bold uppercase tracking-wider">SECURE STATE</span>
              <span className="text-emerald-600 font-black flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                SECURED & VALID
              </span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400 font-bold uppercase tracking-wider">CREDIT SCORE</span>
              <span className="text-amber-600 font-black flex items-center gap-0.5">
                <Zap className="w-3 h-3 fill-amber-500 text-amber-500" /> +{event.xp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Console */}
        <div className="mt-5 pt-5 border-t border-slate-100 z-10 space-y-3 w-full">
          
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-rose-500/10 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-rose-500/25 hover:scale-[1.01] active:scale-[0.99] active:translate-y-0.5 group relative overflow-hidden ${
              isDownloading ? 'opacity-80 cursor-wait' : ''
            }`}
          >
            {/* Flowing shine shimmer hover indicator */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:animate-shimmer" />
            
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4 stroke-[2.5px] group-hover:-translate-y-0.5 transition-transform" />
            )}
            {isDownloading ? 'Generating...' : 'Download Certificate'}
          </button>

          <div className="flex gap-2 w-full">
            <button 
              onClick={handleShare}
              className="flex-1 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Verification</span>
                </>
              )}
            </button>
            
            <button 
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 transition-all flex items-center justify-center active:scale-[0.98]"
              title="Print Credentials"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
          
          {/* Heuristic 9: Help users recognize, diagnose, and recover from errors */}
          <div className="mt-4 p-3.5 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-2xl text-left transition-all">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 stroke-[2.5px] animate-pulse" /> Scanning or Verification Issue?
            </h4>
            <p className="text-[10px] text-rose-700/80 leading-relaxed mt-1 font-medium">
              If scanning fails, credentials display incorrectly, or a ledger error occurs, contact the **Campus Pilot Administrator** at <span className="font-extrabold text-rose-800 underline tracking-wider font-mono select-all hover:text-rose-950 transition-colors">+91 98765 43210</span> or email <span className="font-extrabold text-rose-800 underline select-all hover:text-rose-950 transition-colors">support@campuspilot.nit.edu</span> for instant manual override.
            </p>
          </div>
        </div>

      </div>

      {/* Embedded High-Tech Keyframe animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        .cubic-bezier-spring {
          animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 15s linear infinite;
        }
        @keyframes laserSweep {
          0%, 100% {
            top: 16px;
            opacity: 0.2;
          }
          50% {
            top: calc(100% - 18px);
            opacity: 1;
          }
        }
        @keyframes laserTrail {
          0%, 100% {
            height: 0%;
            opacity: 0.1;
          }
          50% {
            height: calc(100% - 32px);
            opacity: 1;
          }
        }
        .animate-laser-sweep {
          animation: laserSweep 3s ease-in-out infinite;
        }
        .animate-laser-trail {
          animation: laserTrail 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(250%); }
        }
        .group:hover .group-hover\\:animate-shimmer {
          animation: shimmer 1s ease-in-out;
        }
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>,
    document.body
  );
};
