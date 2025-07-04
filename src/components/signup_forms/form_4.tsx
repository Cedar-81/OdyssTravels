import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Form4Props {
  formData: any;
  onChange: (field: string, value: any) => void;
  onImageChange: (file: File) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Form4({ formData, onChange, onImageChange, onNext, onPrevious }: Form4Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      setUploadError("");
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `profile_pics/${fileName}`;
        const { error } = await supabase.storage.from('user-media').upload(filePath, file);
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage.from('user-media').getPublicUrl(filePath);
        if (!publicUrlData?.publicUrl) throw new Error('Failed to get public URL');
        onChange('profile_pic', publicUrlData.publicUrl);
        onImageChange(file); // Optionally keep this for preview
      } catch (err: any) {
        setUploadError(err?.message || 'Failed to upload image');
      } finally {
        setUploading(false);
      }
    }
  };

  const canProceed = !!formData.profile_pic && !uploading;

  return(
    <section className="space-y-6 w-full px-8 lg:px-0 lg:w-[30rem] flex flex-col items-center mx-auto mt-[10rem]">
      <div className="flex gap-2 w-full items-center">
        <button 
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
          onClick={onPrevious}
        >
          <svg width="32" height="33" className="h-5" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.5 7.5L11.5 16.5L20.5 25.5" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="">
          <h1 className="text-xl font-semibold">Stay in Touch</h1>   
          <p className="text-xs">How should we reach you? Drop your email and phone. Set a password to secure your space.</p>
        </div>
      </div>

      <form className="space-y-4 w-full" onSubmit={e => { e.preventDefault(); if (canProceed) onNext(); }}>
        <div className="size-[9rem] rounded-full bg-gray-300 relative mx-auto flex items-center justify-center">
          {formData.profile_pic ? (
            <img src={formData.profile_pic} alt="Profile Preview" className="object-cover w-full h-full rounded-full" />
          ) : null}
          <button
            className="flex gap-1 text-xs rounded-full py-1 px-3 bg-black/50 text-white -top-2 left-[50%] cursor-pointer -translate-x-[50%] w-max absolute"
            type="button"
            onClick={handleButtonClick}
            disabled={uploading}
          >
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.4999 8.66634H9.16658V11.9997C9.16658 12.3663 8.86658 12.6663 8.49992 12.6663C8.13325 12.6663 7.83325 12.3663 7.83325 11.9997V8.66634H4.49992C4.13325 8.66634 3.83325 8.36634 3.83325 7.99967C3.83325 7.63301 4.13325 7.33301 4.49992 7.33301H7.83325V3.99967C7.83325 3.63301 8.13325 3.33301 8.49992 3.33301C8.86658 3.33301 9.16658 3.63301 9.16658 3.99967V7.33301H12.4999C12.8666 7.33301 13.1666 7.63301 13.1666 7.99967C13.1666 8.36634 12.8666 8.66634 12.4999 8.66634Z" fill="white"/>
            </svg>
            <p>{formData.profile_pic ? "change image" : "add a profile image"}</p>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
        {/* Upload indicator */}
        <div className="h-6 flex items-center justify-center mt-1">
          {uploading && (
            <span className="flex items-center gap-2 text-xs text-gray-500 animate-pulse">
              <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Uploading image...
            </span>
          )}
          {!uploading && formData.profile_pic && !uploadError && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Uploaded!
            </span>
          )}
        </div>
        {uploadError && <div className="text-xs text-red-500 text-center mt-2">{uploadError}</div>}
        <div className="flex flex-col space-y-1 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
          <label className="text-xs font-semibold" >Nickname</label>
          <Input 
            className="outline-none border-none text-sm focus:border-none" 
            type="text" 
            placeholder="Add a nickname"
            value={formData.nickname}
            onChange={e => onChange("nickname", e.target.value)}
            required
          />
        </div>    
        <div className="flex flex-col space-y-1 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
          <label className="text-xs font-semibold" >Bio</label>
          <Input 
            className="outline-none border-none text-sm focus:border-none" 
            type="text" 
            placeholder="Tell others who you are and what you are about..."
            value={formData.bio}
            onChange={e => onChange("bio", e.target.value)}
            required
          />
        </div>    
        <button 
          type="submit"
          className="w-full cursor-pointer py-3 text-center rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
          disabled={!canProceed}
        >
          Next
        </button>
      </form>
    </section>
  );
}