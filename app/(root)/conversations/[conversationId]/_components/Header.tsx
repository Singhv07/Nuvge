import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowLeft, Bolt } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Member = {
  name: string;
  imageUrl?: string;
};

type Props = {
  imageUrl?: string;
  name?: string;
  isGroup?: boolean;
  members?: Member[];
  options?: {
    label: string;
    destructive: boolean;
    onClick: () => void;
  }[];
};

const Header = ({ imageUrl, name, isGroup, members, options }: Props) => {
  return (
    <Card className="w-full flex items-center border rounded-2xl p-2 justify-between z-100">
      <div className="flex flex-row items-center gap-2">
        <Link href="/conversations" className="block lg:hidden">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {isGroup ? (
          <div className="flex -space-x-2 *:ring-2 *:ring-background">
            {members?.slice(0, 3).map((member, index) => (
              <Avatar key={index} className="h-8 w-8">
                <AvatarImage src={member.imageUrl} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        ) : (
          <Avatar className="h-8 w-8">
            <AvatarImage src={imageUrl} />
            <AvatarFallback>{name?.substring(0, 1)}</AvatarFallback>
          </Avatar>
        )}

        <h2 className="font-semibold">{name}</h2>
      </div>

      {options && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="secondary" className="rounded-xl p-2">
              <Bolt />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {options.map((option, id) => (
              <DropdownMenuItem
                key={id}
                onClick={option.onClick}
                className={cn("font-semibold", {
                  "text-destructive": option.destructive,
                })}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Card>
  );
};

export default Header;
