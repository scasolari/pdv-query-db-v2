import LayoutTopBar from "@/components/layout/layoutTopBar";
import {useRouter} from "next/router";
import PageOverview from "@/components/pages/overview";
import PageSettings from "@/components/pages/settings";
import {connect} from "react-redux";
import axios from "axios";
import {setOrganization} from "@/redux/actions/main";
import {useEffect} from "react";


function AppID( props ) {
    const {organization, setOrganization} = props
    const router = useRouter();
    const { id } = router.query; // Ottieni l'ID dinamico
    const subPage = router.asPath.split("/").pop();

    const fetchOrganization = () => {
        if(!id) return null
        axios.get(`/api/organization/${id}`)
            .then((res => {
                setOrganization({...res.data, organizationOwner: res.data.email});

            }))
    }

    useEffect(() => {
        if (id) {
            fetchOrganization();
        }
    }, [id]);

    if (subPage === "overview") {
        return <PageOverview id={id} title={organization?.name} />
    }

    if (subPage === "settings") {
        return <PageSettings/>
    }

    return <LayoutTopBar title="404 Page not found">
        <div>Workspace ID: {id}</div>
    </LayoutTopBar>
}


const mapStateToProps = (state) => {
    return {
        organization: state.organization.organization,
    };
};
const mapDispatchToProps = {
    setOrganization,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppID);
