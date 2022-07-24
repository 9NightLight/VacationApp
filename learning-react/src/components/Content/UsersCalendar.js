import React from 'react';
import { auth, db } from "../../firebase";
import { onValue, ref } from 'firebase/database';
import { UsersContext } from './Month';

// export const UsersContext = React.createContext();

export default function UsersCalendar() {
    const {users, setUsers} = React.useContext(UsersContext);

    React.useEffect(() => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            onValue(ref(db, `/users`), (snapshot) => {
                setUsers(new Array());
                const data = snapshot.val();
                Object.values(data).map((_user) => {
                    setUsers(prev => [...prev, {name:_user.name, uuid:_user.uuid}]);
                });
            });
          } 
          else if (!user) {
    
          }
        });
    }, []);

    return (
        <div>
            {
                users.map((val, idx) => {
                    return <div key={idx}>{val.name}</div>
                })
            }
        </div>
    )
}
