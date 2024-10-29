import LayoutTopBar from "@/components/layout/layoutTopBar";
import {setProfile} from "@/redux/actions/main";
import {connect} from "react-redux";

function Overview(props) {
    const {profile, organization} = props
    return <LayoutTopBar title={organization?.name}>
    </LayoutTopBar>
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile.profile,
        organization: state.organization.organization,
    };
};

const mapDispatchToProps = {
    setProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
