# Eurovision Song Context Predictions Scoring Tool

**[Click here to open the tool!](https://castux.github.io/kisastudio/)**

## How to use?

1. Load the list of countries into the leftmost column using the preset buttons, or click "Edit" and fill them in yourself (one entry per line).
2. Decide how many top countries should the players guess.
3. Each player edits the title of their column ("Player 1", etc.) and enters their prediction by rearranging the countries in it.
4. When the actual results are known, rearrange the leftmost column in the correct order.
5. Scores are displayed at the bottom of each column (as points or percentage of the maximum possible score)!

## How does it work?

The actual order and each player's order are compared using this simple count:

**Each pair of countries that you put in the correct order gives you one point.**

That's it! If in your ordering you had guessed that Ireland would be ahead of Azerbaijan, and that was correct, that's one point. Repeat for all possible pair of countries. If you're only guessing the top 5, for instance, all the other countries are put in the bottom of the list and greyed out, and only pairs involving at least one of your top countries are counted.

It's a good method! I swear!

## How does it work in more detail?

This method for scoring is based on the [Kendall-Tau distance for permutations](https://en.wikipedia.org/wiki/Kendall_tau_distance). It's actually the exact opposite (the distance counts pairs in the *incorrect* order, so it is larger when the list are more different, and it is 0 when they are the same).

This gives our score some good mathematical properties which make it a sane choice for the purpose of determining how close to reality your guess is:

- The maximum score is obtained by having all countries in the correct order.
- The minimum score is obtained when all countries are in reverse order.
- Swapping two countries that are next to each other in your list will exactly either give you one point (if they were in the wrong order) or lose you one point (if they were in the right order).
- Therefore, your score can be interpreted as the maximum score minus how many mistakes you made (bad swaps when starting from the correct list).
- Programmers might recognize from that idea that the Kendall-Tau distance is basically the number of swaps that would be needed to sort your list using bubble sort.
- The score for a random permutation is approximately normally distributed, with mean equal to half the maximum score, which feels very right.

For a list of N countries, there are `N(N - 1)/2` pairs of countries, and that is therefore the maximum possible score. When selecting only a top K, there are `N - K` bottom countries, and therefore `(N - K)(N - K - 1)/2` pairs of bottom countries that are ignored. The maximum score is therefore `N(N - 1)/2 - (N - K)(N - K - 1)/2 = KN - K(K+1)/2`.

Even when using only a top K, the score keeps good properties:

- Maximum score: guessed the top K in order.
- Minimum score: guessed the bottom K in reverse order.
- Guessing a single country gives you more points as you guess higher in the actual results.
- In general, a limited top (like 3 or 5) rewards both guessing countries that were high in the final results, *and* guessing their relative order.

## Any drawbacks to this method?

- it considers only the *order* of the results, not their relative scores in points (as in "and 12 points go to..."), so it makes no difference if a country won by a huge advantage or not, and how this was guessed by the players
- likewise, it doesn't handle draws between countries at all (though Eurovision has tiebreakers so that won't be an issue, but maybe in other types of competitions)
- it's too tedious to compute by hand: with 26 countries in the Finals, that's 325 pairs of countries to check for each player
- it might not be super intuitive, especially when comparing the score of someone who got the top 1 correct, but missed the rest, vs. someone who only had mid-level guesses but still made more points (although that might be true of most scoring systems)
