"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Save, Download, Maximize, Minimize, FileText, FilePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const EDITOR_STORAGE_KEY = 'blank-canvas-content';

export default function Editor() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load content from localStorage after client-side hydration
    const savedContent = localStorage.getItem(EDITOR_STORAGE_KEY);
    if (savedContent && editorRef.current) {
      editorRef.current.innerHTML = savedContent;
    }

    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const handleSave = () => {
    if (editorRef.current) {
      localStorage.setItem(EDITOR_STORAGE_KEY, editorRef.current.innerHTML);
      toast({
        title: "Content Saved!",
        description: "Your text has been saved locally.",
      });
    }
  };

  const handleFullScreen = () => {
    const element = containerRef.current;
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        toast({
          variant: "destructive",
          title: "Fullscreen Error",
          description: `Could not enter fullscreen mode: ${err.message}`,
        });
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const downloadContent = (format: 'txt' | 'rtf') => {
    if (!editorRef.current) return;
    
    const plainText = editorRef.current.innerText;
    let fileContent = plainText;
    let mimeType = 'text/plain';
    let fileExtension = 'txt';

    if (format === 'rtf') {
      const sanitizedText = plainText.replace(/\\/g, '\\\\').replace(/{/g, '\\{').replace(/}/g, '\\}');
      fileContent = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Inter;}}\\fs24 ${sanitizedText.replace(/\n/g, '\\par ')}}`;
      mimeType = 'application/rtf';
      fileExtension = 'rtf';
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blank-canvas.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Download Started',
      description: `Your content is downloading as a .${fileExtension} file.`,
    });
  };
  
  return (
    <TooltipProvider>
      <Card 
        ref={containerRef}
        className="w-full max-w-4xl h-[75vh] flex flex-col shadow-2xl transition-all duration-300 ease-in-out fullscreen:h-screen fullscreen:max-w-full fullscreen:rounded-none"
      >
        <CardHeader className="flex flex-row items-center justify-end p-2 border-b">
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleSave}>
                  <Save className="h-5 w-5" />
                  <span className="sr-only">Save</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save Content</p>
              </TooltipContent>
            </Tooltip>
            
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Download className="h-5 w-5" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download Content</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => downloadContent('txt')}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Plain Text (.txt)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadContent('rtf')}>
                  <FilePen className="mr-2 h-4 w-4" />
                  <span>Rich Text (.rtf)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleFullScreen}>
                  {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  <span className="sr-only">Toggle Fullscreen</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-grow relative">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning={true}
            className="w-full h-full p-6 sm:p-8 md:p-10 text-base leading-relaxed focus:outline-none overflow-y-auto"
            aria-label="Text editor"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
