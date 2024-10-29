import LayoutTopBar from "@/components/layout/layoutTopBar";
import {setProfile} from "@/redux/actions/main";
import {connect} from "react-redux";
import OrganizationAvatar from "@/components/organizationAvatar";

function Overview(props) {
    const {profile, organizations} = props
    return <LayoutTopBar title="Overview" dbId={profile?.user?.id}>
        <div>
            <div className="flex flex-col gap-3">
                <p className="text-gray-500 mb-3">Organizations</p>
                <div className="flex flex-col gap-5">
                    {organizations?.map((d, i) => {
                        return <div key={i} className="flex items-center gap-2">
                            <OrganizationAvatar profile={d.name} size={20}/>
                            {d.name}
                        </div>
                    })}
                </div>
            </div>
        </div>
    </LayoutTopBar>
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile.profile,
        organizations: state.organizations.organizations,
    };
};

const mapDispatchToProps = {
    setProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
