import NavigationTopBar from "@/components/navigationBar/navigationTopBar";
import {useSession} from "next-auth/react";
import {setDatabases, setOrganization, setOrganizations, setProfile} from "@/redux/actions/main";
import {connect} from "react-redux";
import {useEffect} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import { Toaster } from "@/components/ui/sonner"
import PostHog from 'posthog-js';
import NavigationBar from "@/components/navigationBar/navigationLeftBar";

function LayoutTopBar({ children, profile, setProfile, title, setOrganizations, setDatabases }) {
    const { data: session } = useSession();
    const router = useRouter();
    const fetchOrganizations = () => {
        axios.get("/api/organization").then((response) => {
            setOrganizations(response.data);
        })
    }
    const fetchDatabases = () => {
        axios.get("/api/database").then((response) => {
            setDatabases(response.data);
        })
    }
    useEffect(() => {
        fetchOrganizations()
        fetchDatabases()
        setProfile(session)
    }, [session]);
    if (!session) return null;
    return <div>
        <Toaster position="top-center" richColors />
        <NavigationTopBar profile={session}/>
        <div className={`${router.pathname === "/app/databases" ? "w-[1110px]" : "w-full"} px-6 lt-md:!px-4 mb-10`}>
            <div className="mb-6 pt-3">
                <h1 className="text-lg font-semibold ">{title}</h1>
            </div>
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
    };
};

const mapDispatchToProps = {
    setProfile,
    setOrganization,
    setOrganizations,
    setDatabases,
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutTopBar);
