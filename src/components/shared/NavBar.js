import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const Nav = styled.nav`
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  width: 100%;
  > ul {
    display: flex;
    align-items: center;
    > li {
      list-style: none;
      margin-right: 30px;
      > a {
        text-decoration: none;
      }
    }
  }
`;

export default function NavBar() {
  return (
    <Nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
      </ul>
    </Nav>
  );
}
