import React, { useState, useRef } from 'react'
import { FormStyled, Button, Input, ErrorMessage } from './Styled'

import { ApiService } from '../models/ApiServices';
import { PeerManager } from '../models/PeerServices';
import { usePeerContext } from '../PeerContext';

export const Register = ({ setUser }) => {

  const ref = useRef(null);
  const [error, setError] = useState("");
  const peer = usePeerContext();

  const validateSubmit = async (value) => {
    if (!value) {
      return {
        error: "You must enter an id"
      }
    } else {
      try {
        const res = await ApiService.createUser(value);
        return {
          value: res.data.userId
        }
      } catch (error) {
        return {
          error: error.response.data.error
        }
      }
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    let validation = await validateSubmit(ref.current.value);
    if (validation.error) {
      setError(validation.error);
      return;
    }
    peer.registerUser(validation.value);
    setUser(validation.value);
  }

  return (
    <FormStyled onSubmit={onSubmit}>
      <div className="form-element">
        <Input ref={ref} type="text" />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </div>
      <div className="form-element">
        <Button type="submit">Register</Button>
      </div>
    </FormStyled>
  )
}
