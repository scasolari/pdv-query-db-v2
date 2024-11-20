import NavigationTopBar from "@/components/navigationBar/navigationTopBar";
import {useSession} from "next-auth/react";
import {setDatabases, setOrganization, setOrganizations, setPendingInvitation, setProfile} from "@/redux/actions/main";
import {connect} from "react-redux";
import {useEffect} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import { Toaster } from "@/components/ui/sonner"
import PostHog from 'posthog-js';
import NavigationBar from "@/components/navigationBar/navigationLeftBar";

function LayoutTopBar({ children, profile, setProfile, title, setOrganizations, setDatabases, setPendingInvitation }) {
    const { data: session } = useSession();
    const router = useRouter();
    const fetchOrganizations = () => {
        axios.get("/api/organization").then((response) => {
            setOrganizations(response.data);
        })
    }
    const fetchPendingInvitation = () => {
        if(!profile) return null
        axios.post(`/api/invitation`, {email: profile.user.email})
            .then((res) => {
                setPendingInvitation(res.data);
            })
    }
    useEffect(() => {
        fetchOrganizations()
        fetchPendingInvitation()
    }, []);
    if (!session) return null;
    return <div>
        <Toaster position="top-center" richColors />
        <NavigationTopBar profile={session}/>
        <div className={`${router.pathname === "/app/databases" ? "w-[1110px]" : "w-full"} px-6 lt-md:!px-4 mb-10`}>
            {!title
                ? <div className="pb-5"/>
                : <div className="mb-6 pt-3">
                    <h1 className="text-lg font-semibold ">{title}</h1>
                </div>
            }
            <div>
                {children}
            </div>
        </div>
    </div>
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile.profile,
        organization: state.organization.organization,
        organizations: state.organizations.organizations,
        pending_invitation: state.pending_invitation.pending_invitation
    };
};

const mapDispatchToProps = {
    setProfile,
    setOrganization,
    setOrganizations,
    setDatabases,
    setPendingInvitation
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutTopBar);
