import styled from "styled-components";



export const FormStyled = styled.form`
  width: 450px;
  margin: auto;
  box-shadow: 1px 1px 4px rgba(113, 113, 113, 0.45);
  padding: 20px 40px;
  margin-top: 200px;
  .form-element {
    margin: auto;
    margin-bottom: 20px;

    input, button {
      width: 100%;
    }
  }
`

export const Button = styled.button`
  border-radius: 4px;
  border: none;
  color: #fff;
  background-color: #358fd7;
  padding: 12px 16px;
  cursor: pointer;
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

export const Input = styled.input`
  outline: none;
  padding: 5px 12px;
  box-sizing: border-box;
`

export const ErrorMessage = styled.div`
  color: #d6440c;
  font-weight: 500;
  padding: 10px 0;
`