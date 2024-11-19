import LayoutTopBar from "@/components/layout/layoutTopBar";
import {useRouter} from "next/router";
import PageOverview from "@/components/pages/overview";
import PageSettings from "@/components/pages/settings";
import {setOrganization, setProfile} from "@/redux/actions/main";
import {connect} from "react-redux";


function AppID( props ) {
    const {organization} = props
    console.log(organization)
    const router = useRouter();
    const { id } = router.query; // Ottieni l'ID dinamico
    const subPage = router.asPath.split("/").pop();

    if (subPage === "overview") {
        return <PageOverview id={id} title={organization?.name} />
    }

    if (subPage === "settings") {
        return <PageSettings/>
    }

    return <LayoutTopBar title={`Workspace ${id}`}>
        <div>Page not found for Workspace: {id}</div>
    </LayoutTopBar>
}


const mapStateToProps = (state) => {
    return {
        organization: state.organization.organization,
    };
};

export default connect(mapStateToProps, null)(AppID);
