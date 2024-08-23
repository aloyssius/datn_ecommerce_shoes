import { Link } from 'react-router-dom';

export default function Logo({ height = 90, ...other }) {
  return (
    <Link to="/"> <img height={height} {...other} src="images/logos/shoes4.png" alt="DKN Logo" /></Link>
  )
}
