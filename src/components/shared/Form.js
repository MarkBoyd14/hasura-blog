import styled from '@emotion/styled';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 1000px;
`;

export const Input = styled.input`
  font-size: 14px;
  line-height: 1.5;
  border-radius: 0.3rem;
  border: 1px solid #ced4da;
  margin-bottom: 10px;
`;

export const TextArea = styled.textarea`
  font-size: 14px;
  line-height: 1.5;
  border-radius: 0.3rem;
  border: 1px solid #ced4da;
  margin-bottom: 10px;
`;

export const Button = styled.button`
  color: #fff;
  background-color: #007bff;
  text-align: center;
  border: 1px solid transparent;
  line-height: 1.5;
  border-radius: 0.25rem;
  &:hover {
    cursor: pointer;
    background-color: #0069d9;
    border-color: #0062cc;
  }
  &:active {
    background-color: #0062cc;
    border-color: #005cbf;
  }
`;
