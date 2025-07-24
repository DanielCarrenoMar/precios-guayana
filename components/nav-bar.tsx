import { Book, Menu, Trees } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { LogoutButton } from "./logout-button";
import Link from "next/link";

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}

interface NavbarProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    menu?: MenuItem[];
    auth?: {
        login: {
            title: string;
            url: string;
        };
        signup: {
            title: string;
            url: string;
        };
    };
}

const Navbar = async ({
    logo = {
        url: "/",
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
        alt: "logo",
        title: "Precios Guayana",
    },
    menu = [
        { title: "Inicio", url: "/" },
        {
            title: "Buscar",
            url: "/search",
            items: [
                {
                    title: "Productos",
                    description: "The latest industry news, updates, and info",
                    icon: <Book className="size-5 shrink-0" />,
                    url: "/search",
                },
                {
                    title: "Ofertas",
                    description: "Our mission is to innovate and empower the world",
                    icon: <Trees className="size-5 shrink-0" />,
                    url: "/search",
                },
            ],
        },
        {
            title: "Mapa",
            url: "/map",
        },
        {
            title: "Perfil",
            url: "/profile",
        },
        {
            title: "Subir producto",
            url: "/create",
        },
    ],
    auth = {
        login: { title: "Iniciar sesión", url: "/auth/login" },
        signup: { title: "Registrarse", url: "/auth/sign-up" },
    },
}: NavbarProps) => {
    const supabase = await createClient();

    const { data } = await supabase.auth.getClaims();

    const user = data?.claims;

    return (
        <section className="py-4 fixed top-0 left-0 w-full z-50 bg-background border-b">
            <div className="container">
                {/* Desktop Menu */}
                <nav className="hidden justify-between lg:flex">
                    <div className="flex items-center gap-6">
                        {/* Logo */}
                        <a href={logo.url} className="flex items-center gap-2">
                            <img src={logo.src} className="max-h-8" alt={logo.alt} />
                            <span className="text-lg font-semibold tracking-tighter">
                                {logo.title}
                            </span>
                        </a>
                        <div className="flex items-center">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    {menu.map((item) => renderMenuItem(item))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {user ? (
                            <>
                                <Link href="/profile">Hey, {user.email}!</Link>
                                <LogoutButton />
                            </>
                        ) : (
                            <>
                                <Button asChild variant="outline" size="sm">
                                    <a href={auth.login.url}>{auth.login.title}</a>
                                </Button>
                                <Button asChild size="sm">
                                    <a href={auth.signup.url}>{auth.signup.title}</a>
                                </Button>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div className="block lg:hidden">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <a href={logo.url} className="flex items-center gap-2">
                            <img src={logo.src} className="max-h-8" alt={logo.alt} />
                        </a>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>
                                        <a href={logo.url} className="flex items-center gap-2">
                                            <img src={logo.src} className="max-h-8" alt={logo.alt} />
                                        </a>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-6 p-4">
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="flex w-full flex-col gap-4"
                                    >
                                        {menu.map((item) => renderMobileMenuItem(item))}
                                    </Accordion>

                                    <div className="flex flex-col gap-3">
                                        {user ? (
                                            <>
                                                <Link href="/profile">Hey, {user.email}!</Link>
                                                <LogoutButton />
                                            </>
                                        ) : (
                                            <>
                                                <Button asChild variant="outline">
                                                    <a href={auth.login.url}>{auth.login.title}</a>
                                                </Button>
                                                <Button asChild>
                                                    <a href={auth.signup.url}>{auth.signup.title}</a>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </section>
    );
};

const renderMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-popover text-popover-foreground">
                    {item.items.map((subItem) => (
                        <NavigationMenuLink asChild key={subItem.title} className="w-80">
                            <SubMenuLink item={subItem} />
                        </NavigationMenuLink>
                    ))}
                </NavigationMenuContent>
            </NavigationMenuItem>
        );
    }

    return (
        <NavigationMenuItem key={item.title}>
            <NavigationMenuLink
                href={item.url}
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
            >
                {item.title}
            </NavigationMenuLink>
        </NavigationMenuItem>
    );
};

const renderMobileMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <AccordionItem key={item.title} value={item.title} className="border-b-0">
                <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="mt-2">
                    {item.items.map((subItem) => (
                        <SubMenuLink key={subItem.title} item={subItem} />
                    ))}
                </AccordionContent>
            </AccordionItem>
        );
    }

    return (
        <a key={item.title} href={item.url} className="text-md font-semibold">
            {item.title}
        </a>
    );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
    return (
        <a
            className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
            href={item.url}
        >
            <div className="text-foreground">{item.icon}</div>
            <div>
                <div className="text-sm font-semibold">{item.title}</div>
                {item.description && (
                    <p className="text-sm leading-snug text-muted-foreground">
                        {item.description}
                    </p>
                )}
            </div>
        </a>
    );
};

export default Navbar;
