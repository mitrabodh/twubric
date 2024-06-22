import api from "../api/users"
import { useEffect } from "react"
import { useState } from "react"

export default function useFetch(sort: string, setSort: any) {
    interface usersData {
        fullname: string,
        id: string,
        image: string,
        join_date: string,
        twubric: {
            chirpiness: number,
            friends: number,
            influence: number,
            total: number,
        },
        uid: number,
    }
    const [users, setUsers] = useState<usersData[] | null>(null);
    const [uselen, setUselen] = useState(5);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/users`);
                if (res && res.data) {

                    setTotal(res.data.length);

                    let dataArray = res.data.map((element: any) => ({ id: element.id, uid: element.uid, fullname: element.fullname, image: element.image, twubric: element.twubric, join_date: new Date(element.join_date * 1000).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) }));

                    if (sort === "total") {

                        const newDataArray = dataArray.sort((a: any, b: any) => a.twubric.total - b.twubric.total);

                        setUsers(newDataArray.splice(0, `${uselen}`));
                    } else if (sort === "friends") {

                        const newDataArray = dataArray.sort((a: any, b: any) => a.twubric.friends - b.twubric.friends);

                        setUsers(newDataArray.splice(0, `${uselen}`));
                    } else if (sort === "influence") {
                        const newDataArray = dataArray.sort((a: any, b: any) => a.twubric.influence - b.twubric.influence);
                        setUsers(newDataArray.splice(0, `${uselen}`));
                    } else if (sort === "chirpiness") {
                        const newDataArray = dataArray.sort((a: any, b: any) => a.twubric.chirpiness - b.twubric.chirpiness);
                        setUsers(newDataArray.splice(0, `${uselen}`));
                    } else {
                        setUsers(dataArray.splice(0, `${uselen}`));
                    }

                } else {
                    throw new Error("Could not fetch the data.");
                }


            } catch (err: any) {
                if (err.response) {
                    console.log(`${err.response.status} ${err.response.data}`);
                } else {
                    console.log(err.message);
                }
            }

        }
        fetchData();
    }, [setUsers, uselen, sort])


    function onRemove(id: string): usersData[] | undefined {

        const usersUpdate = users?.filter(user => id !== user.id ? user : null) || null;
        setUsers(usersUpdate);
        return
    }

    return { onRemove, users, setUselen, total }
}