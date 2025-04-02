
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyCommandProps {
  command: string;
  className?: string;
}

const CopyCommand: React.FC<CopyCommandProps> = ({ command, className }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex items-center bg-docker-primary/10 p-3 rounded-md", className)}>
      <code className="flex-1 font-mono text-sm overflow-x-auto">{command}</code>
      <Button
        variant="ghost"
        size="sm"
        onClick={copyToClipboard}
        className="ml-2 text-docker-primary"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </Button>
    </div>
  );
};

export default CopyCommand;
