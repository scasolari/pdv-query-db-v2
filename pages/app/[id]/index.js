import LayoutTopBar from "@/components/layout/layoutTopBar";
import {connect} from "react-redux";

function App(props) {
    const {organization} = props
    return <LayoutTopBar title={organization?.name}>
        <div>Overview</div>
    </LayoutTopBar>
}

const mapStateToProps = (state) => {
    return {
        organization: state.organization.organization,
    };
};

export default connect(mapStateToProps, null)(App);
