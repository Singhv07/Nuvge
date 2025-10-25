import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowLeft, Bolt } from "lucide-react";
import React from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Props = {
  imageUrl?: string;
  name?: string;
  options?: {
    label: string
    destructive: boolean
    onClick: () => void;
  }[]
};

const Header = ({ imageUrl, name, options }: Props) => {
  return (
    <Card className="w-full flex items-center border-0 rounded-xl p-2 justify-between">
      <div className="flex flex-row items-center gap-2">
        <Link href="/conversations" className="block lg:hidden">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{name?.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold">{name}</h2>
      </div>
      <div className="flex gap-2">
        {options ? (<DropdownMenu>
            <DropdownMenuTrigger>
                <Button size="icon" variant="secondary" className="rounded-xl">
                    <Bolt />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {options.map((option, id) => {
                    return <DropdownMenuItem 
                        key={id} 
                        onClick={option.onClick}
                        className={cn("font-semibold", {
                            "text-destructive": option.destructive,
                        })}>
                            {option.label}
                        </DropdownMenuItem>
                })}
            </DropdownMenuContent>
            </DropdownMenu>) : null }
      </div>
    </Card>
  );
};

export default Header;
