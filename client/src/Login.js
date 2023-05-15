import React from 'react'

function Login() {
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const host_id = urlParams.get('host_ticket');
    if (host_id != null){
        localStorage.setItem('host_id', host_id);
        window.location.assign('/lobby');
    }
    else{
        localStorage.clear();
        window.location.assign('/');
    }
  return (
    <></>
  )
}
export default Login