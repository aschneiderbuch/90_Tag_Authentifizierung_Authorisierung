import { useNavigate } from "react-router-dom"




export const Dashboard = () => {

    const navigate = useNavigate()
    const logout = async () => {
        try {
            const result = await fetch('http://localhost:9999/logout', {
                method: 'GET',
                credentials: 'include',
                headers: { 'content-type': 'application/json' }
            })
            navigate('/')
            console.log(result)
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <section className='dashboard'>

            <h1>Dashboard</h1>

            <button style={{ width: "100px", height: "100px" }} onClick={logout}>Logout</button>

        </section>
    )
}
