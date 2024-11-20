import LayoutTopBar from "@/components/layout/layoutTopBar";
import {connect} from "react-redux";

function Welcome(props) {
    const {profile} = props
    return <LayoutTopBar title="Welcome">
        Overview
    </LayoutTopBar>
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile.profile
    };
};

export default connect(mapStateToProps, null)(Welcome);
