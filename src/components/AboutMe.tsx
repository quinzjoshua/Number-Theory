import React, { useState } from 'react';
import { Phone, Facebook, Mail } from 'lucide-react'; 

export default function AboutMe() {
  const [showToast, setShowToast] = useState(false);
  
  const handlePhoneClick = (e) => {
    e.preventDefault(); 
    
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (isAndroid) {
      window.location.href = 'sms:09165994895';
    } else {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mb-16 relative">
      
      {/* Custom Toast Notification Element */}
      {showToast && (
        // Changed "right-10" to "left-10" here:
        <div className="fixed bottom-10 left-10 bg-zinc-900 border border-zinc-700 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center transition-all duration-300">
          <span className="text-sm font-medium">Cannot access from this device.</span>
        </div>
      )}

      <div className="bg-zinc-800/50 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden border border-white/5">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -ml-32 -mb-32" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-zinc-700 p-1.5">
              <img
                src="https://scontent.fmnl3-1.fna.fbcdn.net/v/t39.30808-6/550732084_1846715409604802_6784265546214443408_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeE35u4eba0yb5CbCk7_sO_LZk7aZFq1OWRmTtpkWrU5ZJTNm_bfcBib4Y0cSZJWAQ9eUmHEmQX5vQXw_3lD6HJz&_nc_ohc=fuA9CIEhwSQQ7kNvwHKAmds&_nc_oc=AdkWe0JlkSuRGzJm65i5CCfqebKTdCTPB9sRvCJhZ-uU3pqhFgGP4ztt_kZLhC6balo&_nc_zt=23&_nc_ht=scontent.fmnl3-1.fna&_nc_gid=anyum2YNMuf4VuBZJGD-Uw&_nc_ss=8&oh=00_AfwnXNmTa3DAsk5i2_D01gPcbasCA6vokPLDLgD2_c__oQ&oe=69B6533D"
                alt="Joshua Bugayong"
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-1">Joshua Bugayong</h2>
            <p className="text-emerald-400 font-mono text-sm mb-4">Full Stack Developer & Math Enthusiast</p>
            
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              I&apos;m a developer passionate about bridging the gap between complex mathematical concepts and intuitive digital experiences. 
              This platform is my tribute to the beauty of Number Theory.
            </p>

            <div className="flex justify-center md:justify-start gap-3">
              {/* Phone Button */}
              <button 
                onClick={handlePhoneClick} 
                className="p-2.5 bg-zinc-700/50 rounded-xl hover:bg-zinc-600 transition-colors text-white cursor-pointer border-none"
                aria-label="Send SMS"
              >
                <Phone className="w-4 h-4" />
              </button>
              
              {/* Facebook Button */}
              <a 
                href="https://www.facebook.com/quinzyyyyyyy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-zinc-700/50 rounded-xl hover:bg-zinc-600 transition-colors text-white"
                aria-label="Visit Facebook Profile"
              >
                <Facebook className="w-4 h-4" />
              </a>
              
              {/* Gmail Button */}
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=quinzjoshua@gmail.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-zinc-700/50 rounded-xl hover:bg-zinc-600 transition-colors text-white"
                aria-label="Send Email via Gmail"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}