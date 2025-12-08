import React, { useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const Dropdown = ({ label, items, alignRight = false, ariaLabel }) => {
    const dropdownId = useId();
    const wrapperRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const openMenu = () => setIsOpen(true);
    const closeMenu = () => setIsOpen(false);
    const handleBlur = (event) => {
        if (!wrapperRef.current?.contains(event.relatedTarget)) {
            closeMenu();
        }
    };

    return (
        <div
            ref={wrapperRef}
            className='relative flex h-[7.5vh] ml-0 z-[1001] group'
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
            onFocusCapture={openMenu}
            onBlurCapture={handleBlur}
        >
            <button
                type="button"
                className='bg-transparent text-[var(--secondary-color)] border-none font-[Inter,sans-serif] h-full my-auto w-auto list-none font-semibold text-lg px-3 lg:px-2 hover:text-[var(--accent-color)] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]'
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-controls={dropdownId}
                aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
            >
                {typeof label === 'string' ? label : React.cloneElement(label, {
                    className: 'text-[var(--secondary-color)] transition-colors duration-200 group-hover:text-[var(--accent-color)]',
                    'aria-hidden': true,
                    focusable: false
                })}
            </button>
            <div
                id={dropdownId}
                role="menu"
                aria-hidden={!isOpen}
                className={`opacity-0 invisible absolute ${alignRight ? 'right-[-60px] lg:right-[-10px]' : 'left-[-60px]'} top-[45px] bg-[var(--main-color)] min-w-[360px] max-w-[360px] lg:min-w-[320px] lg:max-w-[320px] shadow-[0_10px_12px_rgba(0,0,0,0.2)] font-[Inter,sans-serif] rounded-[5px_5px_10px_10px] z-[1002] transition-all duration-200 group-hover:translate-y-2 group-hover:opacity-100 group-hover:visible group-focus-within:translate-y-2 group-focus-within:opacity-100 group-focus-within:visible`}
            >
                {items.map((item, i) =>
                    item.isButton ? (
                        <button
                            key={i}
                            onClick={item.onClick}
                            role="menuitem"
                            className='flex w-full p-2.5 gap-2.5 border-t border-[var(--french-gray)] items-center hover:bg-white hover:rounded-[5px_5px_10px_10px] text-[var(--secondary-color)] text-left border-none bg-transparent cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]'
                        >
                            <img
                                src={item.image}
                                alt={item.text}
                                className='h-[50px] w-[50px]'
                            />
                            <div className="flex flex-col justify-center font-[Inter,serif]">
                                <h4 className='text-[1.1rem] font-semibold'>{item.text}</h4>
                                <h6 className='text-[0.8rem] font-normal'>{item.description}</h6>
                            </div>
                        </button>
                    ) : (
                        <Link
                            key={i}
                            to={item.to}
                            state={item.state}
                            role="menuitem"
                            className='flex w-full p-2.5 gap-2.5 border-t border-[var(--french-gray)] items-center hover:bg-white hover:rounded-[5px_5px_10px_10px] text-[var(--secondary-color)] no-underline justify-between focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-color)]'
                        >
                            <div className='flex gap-2.5'>
                                <img
                                    src={item.image}
                                    alt={item.text}
                                    className='h-[50px] w-[50px]'
                                />
                                <div className="flex flex-col justify-center font-[Inter,serif]">
                                    <h4 className='text-[1.1rem] font-semibold'>{item.text}</h4>
                                    <h6 className='text-[0.8rem] font-normal'>{item.description}</h6>
                                </div>
                            </div>

                            {item.notificationsNo && (
                                <div className="ml-auto flex items-center px-2.5 justify-between">
                                    <h4 className='text-yellow-500 flex h-full items-center font-semibold'>
                                        {item.notificationsNo}
                                    </h4>
                                </div>
                            )}
                        </Link>
                    )
                )}
            </div>
        </div>
    );
};

export default Dropdown;