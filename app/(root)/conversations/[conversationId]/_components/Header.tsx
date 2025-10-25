import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import React from "react";

type Props = {
  imageUrl?: string;
  name?: string;
};

const Header = ({ imageUrl, name }: Props) => {
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
    </Card>
  );
};

export default Header;
