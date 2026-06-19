import React from 'react';
import { Shield, Sparkles, RefreshCw, Trophy, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t border-brand-purple/20" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Luxury Trust Pillars Section (Thai Consignment values) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-stone-800" id="luxury-pillars">
          
          <div className="flex gap-4 items-start bg-stone-950/40 p-5 rounded-lg border border-stone-800/60">
            <div className="p-3 bg-brand-purple/20 text-brand-gold rounded-full shrink-0">
              <Shield size={22} className="text-brand-orange" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wide font-display">สแกนแท้ 100% โดยผู้เชี่ยวชาญ</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">สินค้าผ่านระบบตรวจสอบเข้มงวด มั่นใจได้รับของแท้แน่นอน</p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-stone-950/40 p-5 rounded-lg border border-stone-800/60">
            <div className="p-3 bg-brand-purple/20 text-brand-gold rounded-full shrink-0">
              <Sparkles size={22} className="text-brand-gold" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wide font-display">ระบบฝากขายเกรดพรีเมียม</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">ใครก็ลงทะเบียนเปิดร้านขายของหรูได้ ขั้นตอนอนุมัติว่องไวสูงสุด</p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-stone-950/40 p-5 rounded-lg border border-stone-800/60">
            <div className="p-3 bg-brand-purple/20 text-brand-gold rounded-full shrink-0">
              <RefreshCw size={22} className="text-purple-300" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wide font-display">รับประกันคุณภาพความพึงพอใจ</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">หากตรวจสอบแล้วไม่ตรงสเปก ยินดีดูแลเคสคืนเงินเต็มจำนวน</p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-stone-950/40 p-5 rounded-lg border border-stone-800/60">
            <div className="p-3 bg-brand-purple/20 text-brand-gold rounded-full shrink-0">
              <Trophy size={22} className="text-amber-500" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wide font-display">ความน่าเชื่อถือระดับ C2C/B2C</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">มีสัญญาและเอกสารกำกับทุกออเดอร์ มิตรแท้ของสายสะสมและแฟชั่นหรู</p>
            </div>
          </div>

        </div>

        {/* Footer Link Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-12" id="footer-links">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-purple to-brand-orange flex items-center justify-center">
                <span className="text-white text-md font-display font-bold">P</span>
              </div>
              <span className="text-xl font-display font-semibold text-white tracking-wide">
                paopao
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              แพลตฟอร์มฝากขายและช้อปปิ้งสินค้าแบรนด์เนม แฟชั่น และของสะสมชั้นนำของเมืองไทย เชื่อมต่อผู้ซื้อและผู้ขายด้วยบริการระดับลักซ์ชัวรีที่เชื่อถือได้
            </p>
            <div className="pt-2 text-[11px] text-stone-500 font-mono">
              @paopao.consignment.co.th
            </div>
          </div>

          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">บริการสำหรับผู้ซื้อ</h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><a href="#home" className="hover:text-brand-orange transition-colors">วิธีค้นหาดีลยอดนิยม</a></li>
              <li><a href="#shipping" className="hover:text-brand-orange transition-colors">อัตราค่าบริการและพัสดุด่วน</a></li>
              <li><a href="#refund" className="hover:text-brand-orange transition-colors">เงื่อนไขตรวจสอบงานแท้และคืนสิทธิ์</a></li>
              <li><a href="#review" className="hover:text-brand-orange transition-colors">ประกันส่งมอบปลายทาง</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">บริการผู้ขาย & ฝากส่ง</h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><a href="#partner" className="hover:text-brand-orange transition-colors">สมัครเปิดบูติกร้านพรีเมียม</a></li>
              <li><a href="#consignment-guide" className="hover:text-brand-orange transition-colors">คู่มือประเมินราคากระเป๋า/นาฬิกา</a></li>
              <li><a href="#pending" className="hover:text-brand-orange transition-colors">ระบบอนุมัติไอเทมและลงแสดงหน้าร้าน</a></li>
              <li><a href="#fees" className="hover:text-brand-orange transition-colors">ค่าตงแผงและธรรมเนียมต่ำสุดในเอเชีย</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">สำนักงานใหญ่ แพลตฟอร์ม paopao</h5>
            <p className="text-xs text-stone-400 leading-relaxed">
              อาคารสินสาทร ทาวเวอร์ ชั้น 42 โซนพาเพลิน ถนนกรุงธนบุรี คลองต้นไทร เขตคลองสาน กรุงเทพมหานคร 10600
            </p>
            <p className="text-xs text-stone-400 mt-2">
              <strong>อีเมลบริการ:</strong> luxury.support@paopao.com
            </p>
            <p className="text-xs text-stone-400">
              <strong>โทรสายด่วน:</strong> 02-PAOPAO-VIP (02-726-7267)
            </p>
          </div>

        </div>

        {/* Footer Bottom copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 gap-4" id="footer-bottom">
          <div>
            © 2026 paopao Consignment Platform. All Rights Reserved. แบรนด์จดทะเบียนอย่างถูกต้องตามกฎหมายในประเทศไทย
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with passion for authentic collections</span>
            <Heart size={12} className="text-brand-orange fill-brand-orange" />
            <span>in Bangkok</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
