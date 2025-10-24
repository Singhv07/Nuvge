import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { CircleArrowLeft } from "lucide-react";
import React from "react";

type Props = {
  imageUrl?: string;
  name?: string;
};

const Header = ({ imageUrl, name }: Props) => {
  return (
    <Card className="w-full flex items-center rounded-xl p-2 justify-between">
      <div className="flex items-center gap-2">
        <Link href="/conversations" className="block lg:hidden">
          <CircleArrowLeft className="w-5 h-5" />
        </Link>
        <Avatar className="h-10 w-10 mr-2">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{name?.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <p className="font-medium">{name}</p>
      </div>
    </Card>
  );
};

export default Header;
