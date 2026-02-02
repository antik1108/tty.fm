
import React, { useState } from 'react';
import { LibraryService } from '../services/LibraryService';

interface Props {
    onUploadComplete?: () => void;
}

const UploadView: React.FC<Props> = ({ onUploadComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string>('WAITING_FOR_INPUT');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setStatus(`SELECTED: ${e.target.files[0].name.toUpperCase()}`);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setStatus('UPLOADING_PACKET...');

        try {
            await LibraryService.uploadSong(file);
            setStatus('UPLOAD_COMPLETE. SYNCED_TO_MAINFRAME.');
            setFile(null);
            // Refresh the library after upload
            if (onUploadComplete) {
                onUploadComplete();
            }
        } catch (error) {
            console.error(error);
            setStatus('ERROR: UPLOAD_FAILED. CONNECTION_RESET.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col p-4 border-r border-[#9046FF] relative bg-black/50 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(144,70,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(144,70,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="flex items-center gap-2 mb-6 border-b border-[#9046FF] pb-2">
                <span className="text-xl font-bold">[ UPLOAD_INTERFACE ]</span>
            </div>

            <div className="flex flex-col gap-8 max-w-lg mx-auto w-full mt-10">
                <div className="border border-[#9046FF] p-6 relative group">
                    <label className="block mb-4 text-sm font-bold opacity-80 uppercase">&gt; Select_Audio_Source_File</label>
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-[#9046FF]
                        file:mr-4 file:py-2 file:px-4
                        file:border file:border-[#9046FF]
                        file:text-xs file:font-semibold
                        file:bg-black file:text-[#9046FF]
                        hover:file:bg-[#9046FF] hover:file:text-black
                        cursor-pointer"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="text-xs uppercase font-bold tracking-widest border-b border-[#9046FF] pb-1 mb-2">
                        STATUS_LOG
                    </div>
                    <div className="font-mono text-sm opacity-80 animate-pulse">
                        &gt; {status}
                    </div>
                </div>

                {file && !isUploading && (
                    <button
                        onClick={handleUpload}
                        className="mt-4 border border-[#9046FF] py-3 text-lg font-bold hover:bg-[#9046FF] hover:text-black transition-all uppercase tracking-widest"
                    >
                        [ INITIALIZE_UPLOAD ]
                    </button>
                )}
            </div>
        </div>
    );
};

export default UploadView;
