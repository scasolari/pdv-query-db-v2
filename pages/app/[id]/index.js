import LayoutTopBar from "@/components/layout/layoutTopBar";
import {connect} from "react-redux";
import {useRouter} from "next/router";
import axios from "axios";
import {setOrganization} from "@/redux/actions/main";
import {useEffect} from "react";

function App(props) {
    const router = useRouter();
    const {id} = router.query
    const {organization, setOrganization} = props
    const fetchOrganization = () => {
        if(!id) return null
        axios.get(`/api/organization/${id}`)
            .then((res => {
                setOrganization({...res.data, organizationOwner: res.data.email});
            }))
    }
    useEffect(() => {
        fetchOrganization()
    }, [router]);
    return <LayoutTopBar title={organization?.name}>
        <div>Overview</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
