import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
 
const withRouter = WrappedComponent => props => {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <WrappedComponent
      {...props}
      navigate={navigate}
      params={params}
    />
  );
};
export default withRouter