import styled from '@emotion/styled';

export const Input = styled.input`
  line-height: 1.5;
  border-radius: 0.3rem;
  width: 100%;
  border: 1px solid #ced4da;
`;

export const Button = styled.button`
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
  text-align: center;
  vertical-align: middle;
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
