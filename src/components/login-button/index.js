import {
    useAuth0,
} from '@auth0/auth0-react';
import {
    Avatar,
} from '@mui/material';
import {
    Link,
} from 'react-router-dom';

const LoginButton = () => {
    const {
        loginWithRedirect,
        user,
        isAuthenticated,
        isLoading,
    } = useAuth0();

    return (
        <div>
            {!isLoading && isAuthenticated && (
                <div>
                    <Link
                        to = '/profile'
                    >
                        <Avatar
                            alt = {user.name}
                            src = {user.picture}
                            // sx = {{ bgcolor: deepOrange[500] }}
                        >
                            {'B'}
                        </Avatar>
                    </Link>
                </div>
            )}
            {!isAuthenticated && !isLoading && (
                <button
                    onClick = {() => {
                        return loginWithRedirect();
                    }}
                >
                    {'Logga in'}
                </button>
            )}
            {isLoading && (
                <div>
                    {'Laddar'}
                </div>
            )}
        </div>
    );
};

export default LoginButton;

// import { useAuth0 } from "@auth0/auth0-react";
// import React from "react";

// const Profile = () => {
//   const { user, isAuthenticated, isLoading } = useAuth0();

//   if (isLoading) {
//     return <div>Loading ...</div>;
//   }

//   return (
//     isAuthenticated && (
//       <div>
//         <img src={user.picture} alt={user.name} />
//         <h2>{user.name}</h2>
//         <p>{user.email}</p>
//       </div>
//     )
//   );
// };

// export default Profile;
