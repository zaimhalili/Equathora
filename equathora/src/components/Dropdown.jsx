import React, { useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

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
            className='relative flex h-[7.5vh] ml-0 z-1001 group'
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
            onFocusCapture={openMenu}
            onBlurCapture={handleBlur}
        >
            <button
                type="button"
                className='bg-transparent text-(--secondary-color) border-none h-full my-auto w-auto list-none font-medium text-lg px-3 lg:px-2 hover:text-(--accent-color) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-color)'
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-controls={dropdownId}
                aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
            >
                {typeof label === 'string' ? label : React.cloneElement(label, {
                    className: `${label.props.className || ''} text-(--secondary-color) transition-colors duration-200 group-hover:text-(--accent-color)`.trim(),
                    'aria-hidden': true,
                    focusable: false
                })}
            </button>
            <div
                id={dropdownId}
                role="menu"
                aria-hidden={!isOpen}
                className={`invisible absolute ${alignRight ? '-right-4' : '-left-4'} top-full z-1002 w-[320px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-(--main-color) opacity-0 shadow-[0_10px_12px_rgba(0,0,0,0.2)] transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100`}
            >
                {items.map((item, i) =>
                    item.disabled ? (
                        <div
                            key={i}
                            role="menuitem"
                            aria-disabled="true"
                            aria-busy={item.loading || undefined}
                            className='flex w-full p-2.5 gap-2.5 border-t border-(--mid-main-secondary) items-center text-(--secondary-color) opacity-70'
                        >
                            <img
                                src={item.image}
                                alt=""
                                className='h-12.5 w-12.5'
                            />
                            <div className="flex flex-col justify-center">
                                <h4 className='text-[1.1rem] font-medium'>{item.text}</h4>
                                <h6 className='text-[0.8rem] font-normal'>{item.description}</h6>
                            </div>
                            {item.loading && (
                                <span
                                    className="ml-auto animate-spin"
                                    aria-hidden="true"
                                >
                                    <FaSpinner size={18} />
                                </span>
                            )}
                        </div>
                    ) : item.isButton ? (
                        <button
                            key={i}
                            onClick={item.onClick}
                            role="menuitem"
                            className='flex w-full p-2.5 gap-2.5 border-t border-x-0 border-b-0 border-(--mid-main-secondary) items-center hover:bg-(--white) text-(--secondary-color) text-left bg-transparent cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-color)'
                        >
                            <img
                                src={item.image}
                                alt={item.text}
                                className={item.isAvatar ? 'h-[30px] w-[30px] rounded-xl object-cover' : 'h-[50px] w-[50px]'}
                            />
                            <div className="flex flex-col justify-center ">
                                <h4 className='text-[1.1rem] font-medium'>{item.text}</h4>
                                <h6 className='text-[0.8rem] font-normal'>{item.description}</h6>
                            </div>
                        </button>
                    ) : item.external ? (
                        <a
                            key={i}
                            href={item.to}
                            target="_blank"
                            rel="noopener noreferrer"
                            role="menuitem"
                            className='flex w-full p-2.5 gap-2.5 border-t border-(--mid-main-secondary) items-center hover:bg-(--white) text-(--secondary-color) no-underline justify-between focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-color)'
                        >
                            <div className='flex gap-2.5'>
                                {item.icon ? (
                                    <span className='h-[50px] w-[50px] flex items-center justify-center text-(--secondary-color)'>
                                        {item.icon}
                                    </span>
                                ) : (
                                    <img
                                        src={item.image}
                                        alt={item.text}
                                        className={item.isAvatar ? 'h-[50px] w-[50px] rounded-full object-cover bg-white' : 'h-[50px] w-[50px]'}
                                    />
                                )}
                                <div className="flex flex-col justify-center ">
                                    <h4 className='text-[1.1rem] font-medium'>{item.text}</h4>
                                    <h6 className='text-[0.8rem] font-normal'>{item.description}</h6>
                                </div>
                            </div>

                            {item.notificationsNo && (
                                <div className="ml-auto flex items-center justify-center rounded-full h-5 w-5 text-white !bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] text-center">
                                    <h4 className='flex h-full items-center'>
                                        {item.notificationsNo}
                                    </h4>
                                </div>
                            )}
                        </a>
                    ) : (
                        <Link
                            key={i}
                            to={item.to}
                            state={item.state}
                            role="menuitem"
                            className='flex w-full p-2.5 gap-2.5 border-t border-(--mid-main-secondary) items-center hover:bg-(--white) text-(--secondary-color) no-underline justify-between focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-color)'
                        >
                            <div className='flex gap-2.5'>
                                {item.icon ? (
                                    <span className='h-[50px] w-[50px] flex items-center justify-center text-(--secondary-color)'>
                                        {item.icon}
                                    </span>
                                ) : (
                                    <img
                                        src={item.image}
                                        alt={item.text}
                                        className={item.isAvatar ? 'h-[50px] w-[50px] rounded-full object-cover' : 'h-[50px] w-[50px]'}
                                    />
                                )}
                                <div className="flex flex-col justify-center ">
                                    <h4 className='text-[1.1rem] font-medium'>{item.text}</h4>
                                    <h6 className='text-[0.8rem] font-normal'>{item.description}</h6>
                                </div>
                            </div>

                            {item.notificationsNo && (
                                <div className="ml-auto flex items-center justify-center rounded-full h-5 w-5 text-white !bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] text-center">
                                    <h4 className='flex h-full items-center'>
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