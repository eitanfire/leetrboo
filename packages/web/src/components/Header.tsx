import React, {FC} from "react";
import bannerImage from "../assets/Halloween-costume-contest.png";

type Props = {

}

const Header: React.FC<Props> = ({}) => {
    return (
      <div>
        <img src={bannerImage} className="banner" alt="banner" />
      </div>
    );
}

export default Header;