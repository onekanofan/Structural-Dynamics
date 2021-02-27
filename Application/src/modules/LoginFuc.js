import server from "../server";
import MyLoadingUtil from "../myclass/MyLoadingUtil";

export default function LoginFunction(formdata) {
    fetch(server + 'user', {
        method : 'POST',
        headers : {
            'Content-Type' : 'multipart/form-data'
        },
        body : formdata
    })
        .then((response) => response.json())
        .then((Json) => {
            if (Json.status === 'success') {
                this.storeData(Json.data);
                this.props.navigation.replace("Main", {user : Json.data});
            }
            if (Json.status === 'failure') {
                this.refs.warning.show(Json.reason, 5000);
            }
        }).catch((e) => {
        MyLoadingUtil.dismissLoading();
    })
}
