import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, CornerDownLeft } from 'lucide-react';
import { toast } from 'sonner';

interface SuggestionCardProps {
    text: string;
    tone: string;
    onPaste: (text: string) => void;
}

const SuggestionCard = ({ text, tone, onPaste }: SuggestionCardProps) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('Copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy');
        }
    };

    const handlePaste = () => {
        onPaste(text);
        toast.success('Pasted to input');
    };

    return (
        <Card className="p-4 rounded-2xl backdrop-blur-md transition-all duration-300 border hover:border-primary/40 group relative">
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground bg-primary/10 px-2 py-1 rounded-lg">
                        {tone}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopy}
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto"
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                <p className="text-md text-foreground leading-relaxed">
                    {text}
                </p>


            </div>
            <Button
                onClick={handlePaste}
                className="mt-4 rounded-xl bg-slate-500 hover:bg-primary transition-all duration-300"

            >
                <CornerDownLeft />
            </Button>
        </Card>
    );
};

export default SuggestionCard;
