import Link from "next/link";
import { BiCog, BiCollection } from "react-icons/bi";
import { useRouter } from "next/router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { setProfile } from "@/redux/actions/main";
import { connect } from "react-redux";
import { useEffect } from "react";

function NavigationBar(props) {
    const { profile, setProfile } = props;
    const { data: session } = useSession();
    const router = useRouter();

    const linkActive = (path) => {
        return router.pathname === path;
    };

    useEffect(() => {
        // Se non abbiamo il profilo nel redux store, lo settiamo
        if (session && !profile.user) {
            setProfile(session);
        }
    }, [session, profile.user]);

    // Mostra nulla se la sessione non è ancora stata caricata
    if (!session) return null;

    return (
        <div className="fixed top-[68px] left-0 bottom-0 border-r">
            <div className="flex justify-center items-center h-16">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className="h-[36px] w-[36px]">
                            <AvatarImage src={profile.profile?.user?.image} />
                            <AvatarFallback>{profile.profile?.user?.name?.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                        <DropdownMenuLabel>
                            <p>{profile.profile?.user?.name}</p>
                            <p className="text-muted-foreground text-sm">{profile.profile?.user?.email}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <ul className="p-3 grid gap-1">
                <li>
                    <Link
                        href="/app/dashboard"
                        className={`flex items-center p-1.5 hover:bg-neutral-100 rounded-md ${linkActive("/app/dashboard") ? `!bg-blue-100` : null}`}
                    >
                        <BiCollection size={24} />
                    </Link>
                </li>
                <li>
                    <Link
                        href="/app/settings"
                        className={`flex items-center p-1.5 hover:bg-neutral-100 rounded-md ${linkActive("/app/settings") ? `!bg-blue-100` : null}`}
                    >
                        <BiCog size={24} />
                    </Link>
                </li>
            </ul>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile,
    };
};

const mapDispatchToProps = {
    setProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
