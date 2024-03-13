import {React} from "react";
import { colorsList } from "constants/ColorsList";
import { BsCheck } from "react-icons/bs";
import { selectColorSuccess } from "modules/labels/labels.action";
import { connect } from "react-redux";


const LabelColors = (props) => {
  const {selectColorSuccess,selectedColor} = props

    const selectedColors = (item) => {
      selectColorSuccess(item);
      };
    return (
        <div className="clearfix" style={{
          maxHeight: "100px",
          overflow: "auto"
        }}>
          {colorsList.map((item, index) => (
            <label
              key={index}
              style={{ backgroundColor: item }}
              className="color-label"
              onClick={() => selectedColors(item)}
            >
              {selectedColor === item && (
                <span className="check-label">
                  <BsCheck size={16} />
                </span>
              )}
            </label>
          ))}
        </div>
    )
}
const mapStateToProps = state => ({
  selectedColor: state.labels.selectedColor
})
const mapDispatchToProps = {
  selectColorSuccess
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelColors)