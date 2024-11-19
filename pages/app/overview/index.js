import LayoutTopBar from "@/components/layout/layoutTopBar";
import { setProfile } from "@/redux/actions/main";
import { connect } from "react-redux";

function Overview(props) {
    const { profile, organizations } = props;

    return (
        <LayoutTopBar title="Overview" dbId={profile?.user?.id}>
        </LayoutTopBar>
    );
}

const mapStateToProps = (state) => ({
    profile: state.profile.profile,
    organizations: state.organizations.organizations,
});

const mapDispatchToProps = {
    setProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
