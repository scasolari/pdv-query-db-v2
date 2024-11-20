import LayoutTopBar from "@/components/layout/layoutTopBar";
import { connect } from "react-redux";

function Overview(props) {
    const { profile } = props;

    return (
        <LayoutTopBar title={profile?.user?.name}>
        </LayoutTopBar>
    );
}

const mapStateToProps = (state) => ({
    profile: state.profile.profile
});

export default connect(mapStateToProps, null)(Overview);
