import {logoutAction} from "@/app/actions/auth";

export function Header() {
    return (
        <header>
            <form action={logoutAction}>
                <button className="btn btn-lg btn-primary" type={"submit"}>Logout</button>
            </form>
        </header>
    )
}