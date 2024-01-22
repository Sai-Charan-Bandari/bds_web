import React, { useState } from 'react'

const Login = ({setMainState}) => {
  const [formData, setFormData] = useState({
    id:'',password:''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // CHECK ALL FIELDS ARE COMPLETE
    try{
        let k =await fetch(import.meta.env.VITE_SERVER_URL+'/login-hospital',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(formData),
        })
        k=await k.json()
        console.log('hso login ',k)
        if(k.msg=='done'){
          setMainState({hospitalId:formData.id, hospitalLocation:k.hospitalLocation, token:k.tok })
          localStorage.setItem('bds_tok',k.tok)
        }
      }catch(e){
        console.log('error in logging in ',e)
      }
  };

  return (
    <div>Login
     <form onSubmit={handleSubmit}>
          <label>
            hospital ID:
            <input type="text" name="id" value={formData.id} onChange={handleChange} required />
          </label>
    
          <label>
            Password:
            <input type="text" name="password" value={formData.password} onChange={handleChange} required />
          </label>
          <button type="submit">Submit</button>
        </form>
    </div>
  )
}

export default Login