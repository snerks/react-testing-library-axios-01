import React from "react";
import { cleanup, render, waitForElement } from "@testing-library/react";
import { screen } from '@testing-library/dom'

import FetchGreeting from "./FetchGreeting";

import axios from 'axios';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

afterEach(cleanup);

it("fetches and displays data", async () => {

    const expectedGreeting = "hello there";

    // We'll be explicit about what data Axios is to return when `get` is called.
    // axiosMock.get.mockResolvedValueOnce({ data: { greeting: "hello there" } });
    mockAxios.get.mockResolvedValueOnce({ data: { greeting: expectedGreeting } });

    // Let's render our Fetch component, passing it the url prop and destructuring
    // the `getByTestId` function so we can find individual elements.
    const url = "/greeting";
    const { getByTestId } = render(<FetchGreeting url={url} />);

    // On first render, we expect the "loading" span to be displayed
    expect(getByTestId("loading")).toHaveTextContent("Loading data...");

    // Because the useAxios call (useEffect) happens after initial render
    // We need to handle the async nature of an AJAX call by waiting for the
    // element to be rendered.
    const resolvedSpan = await waitForElement(() => getByTestId("resolved"));

    screen.debug(resolvedSpan);

    // Now with the resolvedSpan in hand, we can ensure it has the correct content
    expect(resolvedSpan).toHaveTextContent(/^hello there$/);

    // Let's also make sure our Axios mock was called the way we expect
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(url);
});