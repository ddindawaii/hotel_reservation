import PropTypes from "prop-types";
const Button = ({ type, children, choice, onClick, className }) => {
  const style = {
    'outline': 'bg-transparent hover:bg-[#c54c00] text-[#eb5b00] text-center font-semibold py-2 px-4 border border-[#EB5B00] hover:border-transparent rounded-lg',
    'solid': 'bg-[#EB5B00] hover:bg-[#c54c00] text-white text-center font-normal py-2 px-4 border border-[#EB5B00] rounded-lg',
    'pill': 'bg-[#EB5B00] hover:bg-[#c54c00] text-white text center font-normal py-2 px-4 border border-[#EB5B00] rounded-full'
  }

  const width = {
    'tall': 'w-full sm:w-[416px]',
    'vtall': 'w-full sm:w-[380px]',
    'smtall': 'w-full sm:w-[106px]',
    'mtall': 'w-full sm:w-[102px]',
    'stall': 'w-full sm:w-[60px]',
    'sstall': 'w-full sm:w-[56px]'
  }

  return (
    <button onClick={onClick}
      className={`${style[type]} ${width[choice]} ${className}`}>
      {children}
    </button>
  );

}
// Menambahkan validasi PropTypes
Button.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  choice: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.func.isRequired
};

export default Button;



