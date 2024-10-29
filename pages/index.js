import {Button} from "@/components/ui/button";
import {signIn} from "next-auth/react";

export default function Home() {
    return <div className="p-3 flex flex-col gap-3">
        <Button className="w-fit" onClick={() => signIn("google", {callbackUrl: "/app/welcome"})}>Login with Google</Button>
        <Button className="w-fit" onClick={() => signIn("github", {callbackUrl: "/app/welcome"})}>Login with GitHub</Button>
    </div>
}
