/***************************************/
/*Chess Board:                         */
/*    a b c d e f g h 
/*    _ _ _ _ _ _ _ _                  */
/* 8 |_|_|_|_|_|_|_|_| <-- black       */
/* 7 |_|_|_|_|_|_|_|_|                 */
/* 6 |_|_|_|_|_|_|_|_|                 */
/* 5 |_|_|_|_|_|_|_|_|                 */
/* 4 |_|_|_|_|_|_|_|_|                 */
/* 3 |_|_|_|_|_|_|_|_|                 */
/* 2 |_|_|_|_|_|_|_|_|                 */
/* 1 |_|_|_|_|_|_|_|_| <-- white       */
/*                                     */
/***************************************/

var pieces_order = ["rook","knight","bishop","queen","king","bishop","knight","rook"];
var dict_pieces = {"pawn":"!","rook":"^","knight":"$","bishop":"&","queen":"*","king":"+"};
var dict_colors = {"white":0,"black":1}

var SUCCESS = 0;
var NO_PIECE = -1;
var MOVE_NOT_ALLOWED = -2;

var white_pawn = new Image();
var white_rook = new Image();
var white_knight = new Image();
var white_bishop = new Image();
var white_queen = new Image();
var white_king = new Image();

var black_pawn = new Image();
var black_rook = new Image();
var black_knight = new Image();
var black_bishop = new Image();
var black_queen = new Image();
var black_king = new Image();

var pieces_sprite = {"whitepawn":white_pawn,"whiterook":white_rook,"whiteknight":white_knight,"whitebishop":white_bishop,"whitequeen":white_queen,"whiteking":white_king,"blackpawn":black_pawn,"blackrook":black_rook,"blackknight":black_knight,"blackbishop":black_bishop,"blackqueen":black_queen,"blackking":black_king}

white_pawn.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAA1CAYAAADcdMIWAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAT7SURBVGiBzZnfT1NXHMA/3FqsXjSjpfzYYAkaQ/RhZptRwPKGNCxMs+1hC0YMMduj4T9wW7aIb8uWxfiAezLoEp+My3DE7cEh2bIsxMCDmI0xhAXMFjC0a3vb7x56Dx4qlHvbW7pP0nBOued8Pz33/LrnQvHsBD4ARoB5IGn//RZ4H6j0IEZRRIDfAcnz+Q1oLyZIRRFle4Cb2C3V3NxMNBolHA6zuLjIyMgIMzMz6toE8DbwTTGybtkPrAASCATkypUrkk6nRceyLLl8+bIEAgHVostA83ZK3gDEMAy5ffu25OPWrVtiGIYSHd4uwWqyg0P6+vryCipOnz6tJJN2+ZJzyg4od+/edSQ5OjqqD6Q33QY0CpB8USUOHjzoqMChQ4f0bKPbgIVIplUilUo5KpBznbNCGoVIPlKJ8fFxRwXu37+vZ6cLiOmaXcA/gLS1tYllWXn7o2VZcuzYMdUf/wYC2yFpAr/YQWVwcDCv5MWLF/VB8zOw221At7e7BvgBeA3ANE38fn/eApWVlZimqbJH7PIhl3EdswsYx26VaDQqs7OzjqagmZkZ6ezs1Ft0jBLd9s9VkDNnzmzZF3NJpVL6pC7AZ14LvgpkAOno6JBUKuVKUJFMJuX48eNKMg0c9lLyJiB+v1+mp6cLElQ8fPhQ/H6/Ev3aK8Eg2a2W9Pf3FyWo6OvrU5L/4tFa/pZdoYyOjnoieefOHb1vnvJC8mNAfD6frK6ueiL59OlTffv24VYCTubJWoBQKMTu3a7n4Q2pqqoiFFqbKmu3ut6JZAZARIrQeh6tvi0rdiL5J8DS0hKxWKwIrWfEYjGePHmyrv58OJGcVYkHDx4UqLWeiYkJPfvHVtc7kfwOsACuX79emFUOw8NrjzoW8L0nlZJ90JdQKCRLS0tFjezFxUUJBoNqZHv6iNuDtm4XQ29vrz5HvuGlJNhLIyDnz5+XTCbjSi6TyciFCxd0wRteCwI0kD3jEewl0ulGI5lMytmzZ3XBx0B9KSTf0SUB6e7ulkQikVcwkUhId3d37vnQY7LLrWfsAb7SgwSDQRkYGJCpqSlHLTk1NSUDAwNSXV2dKzsEVBUrGAR+UpWGw2G5evWqxONxR3K5xONxGRoakpqaGl10nCJ2QnXAhKosGo3KwsJCQXK5LCwsSFdXly76KxB2K+gHflSV9Pb2Frwb3wzLsnIH0zguD1y/VIXPnTv33LGeV6TT6VzRL5wKvqcKtbe3SzKZLImgIpFISGtrqy767laCVdjTTG1trczNzZVUUDE/Py/19fVK8i+yM8qmfKp+0fDw8LYIKq5du6a35kebCb4MxABpbW11vewVSyaTkaNHjyrJVTY5IhwEpKKiQsbGxrZVUHHv3j29NT/JFdxBdqmSSCRSFkFFW1ubkpwDfPBs0xvFPsHt7+/P12dLjhb/JaBT/98NQEzTlJWVlbK25PLyspimue5thUG2SbsATp48yZ49eUd/ydm7dy89PT0q2wUYBtmzxhcATpw4USa19XR2rt3lIHDYAF5X33R0dJTD6TkikYiePWIAr0D2VGHfvn1lkcrlwIED+mnJYYPse0JaWlowjEJeRniPz+ejpaVFZfcbQBNAU1NT2aQ2orFxbcFpNLA3m3V1dWUT2oiGhgaVrN2BvdGcnJzk0qVLZZPKZXJyUiV3VgBxtukFUIHEK8gesP8/RszGpP8DZwZpHH9TLF8AAAAASUVORK5CYII=";

white_rook.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAA0CAYAAAAaNmH0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANXSURBVGiB7ZoxSBtRGMd/SUwMNo04mIIFgy6F0GwWMXQoBW/qaEdFMjWbbiXgJMZRIYN0dSpFELQOdRAJFalYJAQU6qCxGVqCg5GApDSvQ+6ul3h3OY3mDOQHD97de9/7/t/L9+4l7wLVTAJXgDAoP4EB9JkD/pjYCrl9zsB+QB7fyPZK1mfIWh3nAhg3sP1hwVbI/fQYt2C7pjXoqBnAARAMBonFYurNQqFAIpFQLp0Gzh0AQ0NDjI2NXWtcWVlhf39f7aeDOm48Hsfv96sNS0tLZLNZM1sA1gERiUSEllwup41+D/ikUy4BEY1GhR7RaFSxvzSw31N85HK5KttIJKLYrmvF1s68Lm63W3v5Qi5W+urd9wFvb+DPEEviA4EA8Xiczc1NhBCG/bq7u6vSTUssFuP4+JiLiwtDe4fDgSRJBAIBK7KuoZs2dmOUNkaLryWoTZt+gHQ6zejoqA1y9Emn00q136xfHmvPartKXiu2dubfAx8Al9PpJBwO09vbW3dm7ot8Pk8mk6FcLgP8lfWZ8hL5me12u8Xq6qoti3RjY0N0dnYqM14EXlsN2tYArAo3225fAZ+BRx6Ph3A4bDXwhslkMpRKJagIfwNs6/Uz26S2ZcMvfX19nsHBQUZGRu5Y5nV2d3c5Pz/n9PS0hIlwqxwAQpKkpqSMJElKuhzUE2Zlkyo0EnkD1PXb0jtsW7xdtMXbRVu8XbTF20VbvF20xdtFW7xdtLR4S2eVAMVikaOjo/vUovq5S3LYc8CUqyes3swPA08BJiYmWFxctBZuA0xNTbG8vIzsdxj4dptxnLKh6OrqEicnJ035AX52diZ8Pp8y+98B123Ex+QBxPz8fFOEKyQSCW36vLup8C2al9tWypaeSL0Ts8fYd9xhhp/KEaSK3oJVAwqFQgSDwfsWZUg2m+Xw8FC5NH0TqOBH/riSyWRTc72WZDKpTR1/rdCW3mFbWnwHEKJyHq/gVSo7Ozt4PJ6mi9L61zBJ5f8HCl8dwC/gSRM13RW/HVQWQ0uiPipnZmaYnp5WGwqFgvIiy1acTmfVnygWFhaYnZ0FNOK9Xi89PT1qJ239IeH1qkvyv/hUKoXLdavvQE0llUqpdQdQxuLu9cAQLuAZ8JzWCkAAH/8Bfd/WGQIjkvIAAAAASUVORK5CYII=";

white_knight.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAgKSURBVGiBzZp7TFTZHcc/M4NEkICpMrooqI1og0QUsabFGAOY0DRomnV9UEWtFVvSpPURl0R8LNVUWRtNY2lEV6uy0XYtrjXBd4jYf1AbBUwk0eUVQQdTWREVyjC//jFzZs8gDMPMHeg3ucmZe3/z+/0+59zzuOde8E9zgV8BCT7YfgR8DbQAe/yMN6zKAOyAuI4/AyED2CYAzzRbAVYPQ44BaSeeCQtwuh+78UCTsgkNDVW2Xw9Tnn5rD66kk5OTdcg8zcYE3FDX9u3bJ7m5ucquE7AMb8pD015AzGazPH/+XOLi4lTi74FEl02O65ysWbNGRESKi4v1yogZgbx91lpciVZVVcmdO3ckJCSk7y0rgEyaNEnevHkjIiIXL17Urz0CzgOfAT8Bxo4EyECaDHQBsnz5chER2bFjR7+Ax48fF6Wqqqp+bVxHL/AQ2AXMMDJZk5//+xeQOm/ePO7fv093dzfFxcXYbDa3QVxcHJs3b8Zi+a67nTlzhmvXrv3XZrOF1tfX09TUhMPh6M//PeBz4B9AvwbBVCzQA0heXp74oSZVaG9vl/LycikoKJCkpKT+WrYO+GS4Af8GiMlkknv37vkD2DbQhbq6Otm9e7eMHz++L+g/XRUbdH2sgmZnZ/sDJyLSO5hBZ2enHD58WKxWqw75GvhpMOGSgDeAREVFSUtLi7+APuvVq1eSm5srJpNJQdqBT4MBFwZ8A4jFYpHy8nLp6OiQlStXSmxsrBQWFgYVtKysTMaMGaO35u+NBtyrnBcVFYnD4ZAlS5a4A5rNZrHZbEGFrK6u1hcVAvzOKLg44C0gc+fOFbvdLidOnPAYBCwWi7S3twcVUETk6dOnMmHCBH3u/JkRgF/hGjVv374tDodDpk6d6gGYkZERdDilmpoaGTt2rIrdToCj60KcE6171KypqfGAU+DDqbKyMj2Ha/i5YDEBVYCEhYVJY2OjiIjU1tZ6AG7ZsmVY4ZQ2bNig57HRH8CfKwc7d+70cL5r1y5JSUmRvXv3Sm/voNNav7px44Zs27ZN2toGnPe96vXr1/qg8wznSO+zwoBmQCZOnCgdHR1+JeFNsbGx/VbeUHT69Gm9FXcMBdD91K4/ERil3t5e97y2fft2v/3Y7XZJTExUgP8BInyBGw90ADJ79myx2+0GojlVWVnprvmTJ08G5KvPgLPJF8CD6g9Xr141CMlTmZmZ7n0af/ugkt1ulylTpijAB4PBTcC5ZyILFy40CMdTp06dctf40qVLDfFZWFiot+IPvQEeVoYVFRWGBNdVW1sr4eHh7mTOnTtniN+WlhZ92+TIQHAfAe8ASU9PNySwrmfPnsm0adM85lAju8DixYuV3290KLNW3olrLiksLBzsVh6S2traSE9Pp6GhweO8yeTvjsmHysrKUsXvA7P6Xo/DtZGUmZlpWK2KiDQ3N0tCQoLecl+p8s2bNw2L8+TJEz1Gfl/AP+JaV969e9ewoI8ePZLJkyfrgb9A23Z8/PixYbFERGbOnKmvT90KwzlJSlpammHBrly5oq/6Vec341pEmEwmefv2rWHxREQ2btyoYn2L1v3WqyQuXLggzc3NkpOTIykpKVJSUjLkIA6HQw4ePCgWi0UFc+C5zXAaEKvVaiiciEhJSYleoe43X+dxrTl7enpkxYoVYjabJSIiQgB58OCBzwFevnwpWVlZepBOPtz2awQkKyvLcMDq6mo99i9wNeOPADIyMggJCcFmsxEaGurekNU3c73p1q1bJCUlcfnyZR0kFeegojQdmAKQlpbmk9+haNasWUREuJejKarwFm3Re+nSJYmKihJcfbKrq8trrfX09Eh+fr6YzWa99v5O/+8bPlM2tbW1hregiMj8+fNVDrdU0CZA1q9f7zZ69+6d1NXVDeqstbVVFi1a1PeW/OUAFTwKaAVkwYIFQYETEcnOzla5NKvA/8bLvkpBQYEkJibK2rVrpbOz032+vr6+7y7XA+AHXu6gLcr27NmzQQPcs2ePPriFAxQDMnr0aPerLqWKigqPpdWxY8dEROTFixd9N55OAKO9wE3EOXTLjBkzpLu7O2iApaWlel6zzcBFgK6uLoqKijyyam1t9fhtt9ux2+2sWrWKxsZGdfoPOG/LrgHgLMCXQBTAkSNHCA0N9VIXgWn69On6z2ng/IDgLi7qZcuWyYEDB+TQoUPu5zZARo0aJW1tbbJ161a9hv7qQ8zPlX1OTk7QWk6psbGx3wfgeKBNu/DBsXr1ajl69GjfPjfYRs9WZZ+YmOjRh4Ol9+/f6zkW6MlYgeOATTNwfy6iJn7X8RLnqt2bfo1rTzUmJkYaGhqCDqcUGRmp8vzTQMmNxdVngPI+rdmKNokOoO3Kfty4cVJdXT1scCIi8fHxKtfzg+QJOB+ljgLHcL7wGDeI/acKLjo6Wh4+fDiscCIiqampH0z2Ruk3Cs5qtUpNTc2ww4mIPjhWDfQJlj9ahuuej46OpqKigoQEXz5lM17h4eHuotmb4RAUD5wBTJGRkVy/fn3E4ADCwtyDuyGAJuAvQKTZbKa0tJQ5c+YY4NZ/aS0YZgTgJ0A6QF5enr75M2IyugV/C2C1Wtm/f78B7gKXBjg6UMBZwI8BNm3aRGRkZIDujFeggOmqsG7dugBdGScRcRcDBUwFiImJIT4+PkBXxslIwHiA5OTkAN0YKx0w0In+ewD19fXk53+wmTxiqqysVEUJ9OXAt3y3KP9/1JtAb9ER+Z7TRzmAc/8DtOTx0Ng2oYwAAAAASUVORK5CYII=";

white_bishop.src = "data:image/png;base64,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";

white_queen.src = "data:image/png;base64,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";

white_king.src = "data:image/png;base64,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";

black_pawn.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAA1CAYAAADcdMIWAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJYSURBVGiB1ZlNaxRBEIafdEzWyAq66vpBFCT3LIlelBCPgnrXk+SiBP+Ef0EUj+JREvAa9JaLEvQgnv0IiR94UVFQYsImHno7Dsuy011dPb2+8LLD7lbPQ81Md3UNxKsG3ASeAp+Bzc7nE+AGMKpwjijNAKvATh+/B87nArwC/CkBdN4ALlUNOAH89AR0/gGcrhJyIRDQ+VFVgAexD4cEcrMTHyQjgJwFRgRxdOJmQoMkkCcEMUWNhwZIINuCmKK2QgMkkG8FMUW9iYz30hjwHdmD8w3YG3pCSSYNdhWR6J3wnEE6DLxElkXnF8ChVIBjwEokoPNzBJfdR3eVAJ3vaANOAdvKkG2gpQn5WBnQeVELsIF/SRbqDTzWcp/p4ALpqusathboKx/IqXiWuPF9IJsKIFHj+0BuK4D0007ZH3wgPyiARI3vA7muANJPaxqDNLE1YIopaAs4pgEJdqOfAnJJCxDsHjsFpPpeXHtpXNAGBDiO7fFoAH4i4F4MqZK1+znnNAfbDzwkzT35AKjHAjaw5X4KQOcVBF0Np6PA68SAzq+AI6GAI8CzigCLGQ0qCe9XDOh8zxfwWiZA56tlgHX05kKpv2BnlF0Nd0HeJkPbuEt1bOGx3OvHU8Bv8mbR+ReFFmFxxbmF7VIMgvYB891f7sGup7kzWPRHum7HywMA1csX4d/lvt4769k15w6GkTdFU/srYAwwDRxQz4GOGkDLAGdyk5TorAEmc1OUqGWw7wkHWRMGOJmbokTjBkGxWbGahgF4s1+i2v8AOTqEbbAnfwEUofZfnJ6k+PrVSJAAAAAASUVORK5CYII=";

black_rook.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAA0CAYAAAAaNmH0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJ1SURBVGiB7Zq/i9pQAMc/Z0RKtNfepODSwxZLrdMNtxSHQFGoc7cDEdoOBf8B58O53tIuxbF0vBsUDoSDLoWbFDr06lQEs2kDcthIOhghShLjj+tTyAcy+PK+L5+XvLyEZ2CWAnALGA7bb+AQe06Bvy5Zw9x/6pA/NNt3yt6afo6cLzi4AZw4ZH96yBpmPTtOPGTPrYHAXAN7bj1zyCyTdavn1K5jNujxgFbeA69symMe8zHgq035oxVcZrjA26UXtV1YZb1cqq3FlxfFzA0rSdJBLpdDlmVRPo4Mh0MajcbBeDy2r5DJZFRji8lkMqrVd2belCSpmM1mP4XD4VWm0Dul3+/rzWbz3Xg8/uxWLwH8QPy0aN1ugKfzok5Pu4dMHiQvAdLpNKFQyK3DG2U0GtFut6c/L4HXQH+ZNoLAmaIoQsa3oigGcIbLW8DC9xFZlm+KxeLjcDi8TMfXQtM0arXar+Fw+GTdtq4QM86vFont9EPKlxeFLy8KX14UvrwofHlR+PKi8OVF4cuLYqflF67PJBKJZLVa/e+rB6VSKdnpdFzrLZI/lmU5mk6niUQim7NbgKZpyLIcBY6B76u0IQHXiF1sujY9bHE782/z+fxRKpVautebotVqHdXr9TfAx2VyTcBQVbHrrqqqTq9A007SbtHpPvAHIB6PE4t5/atp8/R6Pbrd7vTnPqBZ99vJ7wODO/ZahQeYJ3XKTs/zvrwogsAz4IWl7F6hUKBcLhMIiO+brutUKhVqtVqByfcHU74FmUxD0fnAYLA996yu6wAf5orVPSbz6E4iflysgS8vigC7O+YNCUgCz/H+sc82YABf/gGq48famgtLgwAAAABJRU5ErkJggg==";

black_knight.src = "data:image/png;base64,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";

black_bishop.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA6CAYAAAAKjPErAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASvSURBVGiB3ZtfaFtVHMc/abrMxSX9YzeMblJkRa3Fiq1/0WERqlmHL32Qok/WR6ETFPQlYLYHBUXfjS/6EESqT8qUQB+UFaWow6br7IMSM6ZI2yS2g2VNjg+/3LWpaXLvuffcTD/wI804597vN+fec37nz8Af7gY+BLLAJrAIpIC7fLq/cZ4FrgCqQWwCJ9snzRvuQIw0MmjFBnDEpIgOkxcHXgbCLcrcXCtnDNMmH7dZ7gmTIkyb7LFZrtekCNMm/7BZ7rJJEaZNfm2z3FdGVRimC7hE8971dyDaLoFeMQYUaGxwHXiybco84CbgDaBE85YsAq/Xyv+neAb4jebmdsevwNNt0OqYEPAOUMWZQSuqwNvAPr+F26UHOIeeud3xDdDtr/zWHAZ+xBuDVvwAHPLTRDMOAufx1qAV52vXbysBYBabosPhsJqYmFDhcNiJ0U9r92kbMw1E7RmpVEoppVQqlXLaoq5mKW7SuhiQdFKhv7+/7tMBZ4BbnVaycGPyNP6lY104/EF30qlZrw94vlWhYDDI4OAgoVAIgGg0ev1zZGQEgHK5zNLSEpVKpdXlXkAyqFVNzY55FRvvUjqdVnZIp9N2381XdMTqPq5xO4X6+vpsXcxuOeCE3YI70emaQ8is4kCrgt3d3YyNjdHZKW9FIpFgaGiIxcVFkkl5xba2tpibm6NQKNi59xUksypr6HbEMTQH90wmo5RSKpPJuEkQ7nQqWOdxvU2jjpfEnFbQManbI7O6ulr3qUnQTWW7jKD5qMViMTUzM6NisZibx/V+P0z2oj9fdBsVJDFwhM7jugZc0KjnBVlkucQRuuPk55r13PKZnzc7goxVfj6qZdrQs5/xQLiTeNMfW/XsB+Y1xOrEt0impYXbGXcXcBZ4BCCZTDI1NUVHh/4Mrlqtkk6nSSQS1j+dQ3LlkkutrtgHvAeoYrFoa9bRimKxaLXgu3iwPKmdvexgP7IVwPT0NJOTkwSD+klJpVJhdnbW+vpU7frX3Ip0y8eYfR8/8s9KYx7DfPZTBR71y1AjTLeiJ63pqneNRqOFgYEBx7mkU1ZWVtZLpZLRLfeGjI+PH83n8570pq3I5/MqHo9rH4PRHtCWl5fjkUhEt7ojIpEI2WzW1rpSI7SHkFwu1zU8PMzo6CiBgLlVfKUUCwsL5HI5469FI57D39x1yh9b9dyuKVY3+n1x1YDXkNm6SXMV5ExBWzkOfI8Zg9/Vrn/D8DDwPnARd8aWkYT/Qa+EedktBpFdrkPAvcj06yFkda3Z/n8B+Al5GuaBJeAvZGrVchfIDnuZPAzcBzwADAG3IKt0PWxPfToBa6AMIUc6vWaT7S2Bv4Gt2t/XkINOa8gu18/ImYX5Wp2mnEAmqe1acnQb68BbSKP8i4PAJzeASK/iT2Qcv84B/Fur8TtOA4Eg8AH/g8Pue3Ac6A0gK9J+HsVcw/BJ5V2UAsCLSGs2m5FcRX6Mjdp3a7jYTSeyJrOJbJhuADnkcOAF4EvgF+T/g8SBe5D9xqNIvxBGeumrbPekdYLZHlYiyGphs6XKKvCS9eUkcnp4DTkq/QVwCmnutmT/DuhCdJ5CfsTLiI+z1Lbf/wFPdWiJ+/RyjgAAAABJRU5ErkJggg==";

black_queen.src = "data:image/png;base64,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";

black_king.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAYAAADhu0ooAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAr8SURBVGiB7ZtrUJTnFcd/C+LKctWiFoOIEC6KCATFjJ1ANKiZdrykI2SMFi0OH4K0pjopScWYMZPBKoOTeslNyRjtZIxa62UwwjQxUg2KmZKUKCw3qQbsAnJfLsvu6YeFV3ABF9zF6Uz+M2f23X2f5/zPeS7nuS6MLZyBa8AtYPIYc48pIgHplV+NJbHDWJI9xDem3Co763cGMoBpvd8nAnG9z1eAmt7n+8Cfej//L7GKB031UbLJnoaMs6dy4BLwd2B673cNMKv3uRxo7n2uB87a2ZYxRRQPanD5WBKPdTB6YvjJ0Z8wOqiA32KeEfX10Wrgd4DTE7TLptAA5xl6WMkHJj0x62yI0zx6DP0n9h/q7Ir1WD9heOMJ2fjYcAb+i/WO6oGp9jLGnlF3JTBlBOmdgbV2ssWqfjEbeA7zxNwLaAV0QDFQCDQOke/5UdgTA2QN8rs3MK/XlomAG1AH1AIFwL8B0yj4cAZ+D1QxfHMzApeBVMD9IR1nHpF3MLnWL/9UzP32X1bk0wF/5sGc2gKDLdOigBPAzFmzZrFy5UrCwsLw9/fHycmJzs5OtFotWq2WS5cuUVhYiNFoBPME/QCwB2gCTgG/Hop4CFzpzbMNSMZc4EyZMoUXX3yRiIgIgoODmTrV3JV1Oh23bt3i6tWr5OTk0NHR0Q28A+wCeoYjWgF0RkdHyzfffCPWoKGhQfbv3y/h4eF9pXsPc1/bx+hqtB4QtVot69atk/z8fDEajY+0o62tTTIzM2XixImCuTn/bCgno4H29PT0AYqNRqNotVo5d+6cfP7555KbmytVVVWDkufk5Mi8efP6jC4chaPi6OgoSUlJcufOHQv9jY2Ncv36dTl58qScOHFCrl27Js3NzQPS1NXVSVxcnGDutxZRXA1UvP322wNKaPv27eLj4zOoQV5eXrJmzRo5ffq0GAwGJZ/JZJJDhw6Jp6fniJ2cPXu2FBYWDjD8zp07snPnTpk3b544ODhY5HFycpJly5bJF198oeTp7u6W9evX9826BgTcN2JjY8VkMomISGVlpQQEBFhtoLe3t2RlZYler1fIampqJDY21modycnJ0tHRoeSvqKiQNWvWiKOjo9U6Vq9eLW1tbSIiYjAYZNGiRYK5zwIwwdHRsb6kpERERFpaWsTPz2/EtQGIj4+PnD17dkDJpqamDptHpVLJnj17lDwGg0F27twp48ePH5UN8+fPV5ytq6uTSZMmdWEeFvnNCy+8oBC99tproyLoL4mJiQNqd8eOHUM6eeDAgQGtYMGCBY/N/8orryg6k5KSBPgDwIn3339fREQ6OjrEw8PjsYkAiYyMHBBQ3nrrLYs0GRkZyvvi4mKZPn26TbgdHBzk7t27IiJy5swZAXIBKq9cuSIiIl999ZVNiPokICBAbt++rQSphIQE5V18fLwSE27duiVTp061Kffx48dFROTmzZsC/AjQ0Vfyhw8ftikZIE8//bQ0NDSIiEh7e7sEBgaKr6+vtLS0iIhIfX29zJgxw+a8+/btU/op0DEOUBkMBgAcHR2xNcrLy3n55Ze5ePEiGo2GDz/8kNbWVtzc3BAR1q5dS3V1tc15vby8ALh//z5AG0BZfn6+iIgUFBTYvGT75L333pOHkZ2dbTe+vi5z7tw5Aa4CHN+9e7cS2qdNm2YXYldXV6mtrVWcbGlpES8vL7twxcbGKjy9w9ufAeIjIyOVF5mZmXYr5bS0NIUnKyvLLhwODg7S10JbW1vFy8vLBIQCTADufvnllyIi0tXVZZOxbDB55plnFEdXrFhhF46tW7cqHBkZGQLk0A/J4eHh0tnZqQzcQ81xH0ciIiIUI1auXGlz/fHx8cpio6ysTDQaTRcPznoA85bKPzZs2DBgAPf19bWpIeHh4Yr+l156yaa6lyxZolRUY2OjhIWFCfBHBoE3UJ2ZmakYU1NTI9HR0TYzJiQkRCnxkUz4HyUpKSnS3d0tIubZXUxMjGDePBjy/DdUpVLV9p+adXd3y/bt28XJyWlYMh8fH1m6dKmkpqbK/v37JTc3V7RardTU1EhTU5PF0NLZ2SkNDQ1SUVEh169fl2PHjkl6erokJCRIZGTkI/kAcXNzk8OHDys629vbZfny5YJ5yqceysk+BAAVycnJSlMQESkpKZFVq1YpJC4uLhIXFye7du2SGzduWDjyuGhvb5e8vDxJS0uTqKgoUalUFk21qqpKSV9dXS2RkZEC/HUwJ4eqWm/gRFhY2C+OHDlCZGSk8uLgwYP4+fmxdOlSxo0bfBOxvr4erVZLWVkZLS0t6PV6mpqa0Ov1dHV14enpiUajQaPR4O7ujo+PD0FBQfj5+Q2ps7KykiNHjnD58mW2bNnC8uUPjlcvXrxIYmIiOp3uXWB7b2FYjXHAO05OTj2bNm2y2LLoQ2trq5w/f142b94szz77rEyaNGnUfW38+PESEhIi8fHxcvDgQSkvLx+21puammTjxo2iUql0mPeRHwsRb7755o/9CXQ6nezdu1diY2NHvUC2Vvz9/eXVV1+Vq1evWjg5efJkwXx14OeP6yQAW7Zs+VtPT49otVrZsGGD1c55enqKv7+/zJkzRxYsWCBxcXGyZMkSiYmJkaioKAkICBBvb2+r9c2dO1dycnKkp6dH8vLyTMBSa32w9vrNbnd399fb2towmSw3xCdPnkxsbCyhoaEEBwcTFBREUFAQbm5uVik3Go3cvn0brVZLaWkpWq2WgoICvvvuu0H53N3daWtrM5hMpvFW2m81dtOvZJ2cnJSI++2331q17zoa6HQ6+eyzzyQpKWmwxUb3SBywukaB12fOnElqairr1q1jyhTL8yODwUBVVRWlpaWUlpZSVVVFQ0MDer2ejo4OGhvNxzTOzs5oNBo8PDxwdXVl2rRpBAcHK63B09PTQrfRaCQ3N5ePPvqIs2fPYjKZDIBta9TX1/cv2dnZA/ZvRcwLgEuXLsm2bdskOjraqkHeGnnqqackMTFRjh49OmBp14fi4mJZtmyZwaZOAnz66aeX+0iMRqNcuHBBEhISxMXFxa4RF8w7hREREZKVlSU6nW5Asx6JD1Ydp588ebIyIiLiuaKiInbt2sXNmzeHTa9WqwkMDMTPzw8XFxeliWo0GtRqNW1tbTQ3N6PX69Hr9dTW1qLVaqmrq7PQJSIUFRVRVFTEtm3bSE5OZuPGjVy4cGFEx4Qj6qODvXB1deX5559n8eLFzJ49m6CgIGbMmIGDw8jPmBsbGykrK6O0tJSCggLy8vIoKysbKrnt+ygPRd2QkBBJT0+Xr7/+Wlk1WAOTyTRgY9saVFVVyccffyyrVq16eLy1T9R1cHB4ffXq1WzevJmFCxdaJNDr9Xz//feUlJQo56fl5eW0trYq89zOzk4zqUqFp6cnLi4uaDQapk+froy9wcHBhIaG4uvra8FRV1fHJ598wt69e7l3757ta3TRokWHfvjhhwElbTQa5caNG5KRkSGLFy8WtVpt0yAUGBgoKSkpcvr0aYtlnl6vl7S0tGEPekeFo0eP5veR1NTUyI4dO2y++zCcqNVqiY+Pl9zcXMXZ+/fvj+rOwrBISUlZeOrUqf+kpKTIhAkTxszBwWT+/PmSnZ3d8cEHH+y1uaP98EtGeZJtI2kE3gU87Olkf8QAxzBv9Y+Fg4WYL0hat0qwA1yBeOAQj76qMxJpBfKArUCQLQy19b8kPIE5vTIX8Md8AcoD8z0kd8z7OS2Yr+g09z7fw3y5orj3s6/QbIb/AbL2FHq5i9tEAAAAAElFTkSuQmCC";

// get index from string chess type position
function get_index(pos){
    return [56 - pos.charCodeAt(1),pos.charCodeAt(0) - 97];
}

function chess_piece(piece_type,color,position){
    this.piece_type = piece_type;
    this.color = color;
    this.position = position;
    this.moves = [position];
    this.state = "normal";
    
    this.get_index = function(){
	return get_index(this.position);
    }
    this.get_position = function(){
	return this.position;
    }
    this.set_position = function(new_pos){
	this.position = new_pos;
    }
    this.get_color = function(){
	return this.color;
    }
    this.set_color = function(new_color){
	this.color = new_color;
    }
    this.set_state = function(state){
	this.state = state;
    }
    this.can_move_to = function(pos){
	var idx1 = get_index(this.position);
	var idx2 = get_index(pos);
	var dx = idx2[0] - idx1[0];
	var dy = idx2[1] - idx1[1];
	var adx = Math.abs(dx);
	var ady = Math.abs(dy);
	if(this.piece_type == "rook"){
	    return (adx==0 && ady!=0) || (adx!=0 && ady==0);
	}
	else if(this.piece_type == "knight"){
	    return (adx==1 && ady==2) || (adx==2 && ady == 1);
	}
	else if(this.piece_type == "bishop"){
	    return adx == ady;
	}
	else if(this.piece_type == "queen"){
	    return (adx==0 && ady!=0) || (adx!=0 && ady==0) || (adx == ady); 
	}
	else if(this.piece_type == "king"){
	    return ((adx + ady) == 1) || ((adx == ady) && adx==1);
	}
	else if(this.piece_type == "pawn"){
	    if(this.moves.length == 1){
		if(this.color == "white"){
		    if(dx == -2 && ady == 0)
			return true;
		}
		else{
		    if(dx == 2 && ady == 0)
			return true;
		}
	    }
	    if(this.state == "attack"){
		if(this.color == "white"){
		    if(adx == ady && dx == -1)
			return true;
		    else
			return false;
		}
		else{
		    if(adx == ady && dx == 1)
			return true;
		    else
			return false;
		}
	    }
	    if(this.color == "white"){
		if(dx == -1 && ady == 0)
		    return true;
	    }
	    if(this.color == "black"){
		if(dx == 1 && ady == 0)
		    return true;
	    }
	    return false;
	}
    }
    this.move_to = function(pos){
	this.position = pos;
	this.moves.push(pos);
	this.state = "normal";
    }
    this.draw = function(ctx,dim){
	var idx = this.get_index();
	var h = dim/8;
	var x = idx[1]*h + h/10;
	var y = idx[0]*h + h/10;
	ctx.save();
	ctx.beginPath();
	/*
	  ctx.font = "30px serif";
	  ctx.fillText(dict_pieces[this.piece_type] + dict_colors[this.color],idx[1]*h + h/4,idx[0]*h + h/2);
	*/
	ctx.drawImage(pieces_sprite[this.color + this.piece_type],x,y)
	ctx.closePath();
	ctx.restore();
    }
}
function chess(){
    // Create board
    this.board = [];
    for(var i = 0;i<8;i++)
	this.board.push(new Array(8));
    // Create pieces
    this.white_pieces = [];
    this.black_pieces = [];
    this.white_eaten = [];
    this.black_eaten = [];
    this.selected = "";
    
    for(var i = 0;i<8;i++){
	this.black_pieces.push(new chess_piece(pieces_order[i],"black",String.fromCharCode(97+i)+"8"));
	this.black_pieces.push(new chess_piece("pawn","black",String.fromCharCode(97+i)+"7"));
	this.white_pieces.push(new chess_piece(pieces_order[i],"white",String.fromCharCode(97+i)+"1"));
	this.white_pieces.push(new chess_piece("pawn","white",String.fromCharCode(97+i)+"2"));
    }
    // Place the pieces
    this.init = function(){
	for(var i = 0;i<16;i++){
	    idx = this.white_pieces[i].get_index();
	    this.board[idx[0]][idx[1]] = this.white_pieces[i];
	    idx = this.black_pieces[i].get_index();
	    this.board[idx[0]][idx[1]] = this.black_pieces[i];
	}
    }
    // Convert board with pieces in it to string
    this.to_string = function(){
	var s = " __ __ __ __ __ __ __ __\n";
	for(var i = 0;i<8;i++){
	    for(var j = 0;j<8;j++){
		if(this.board[i][j])
		    s += "|"+dict_pieces[this.board[i][j].piece_type] + dict_colors[this.board[i][j].color];
		else
		    s += "|  ";
	    }
	    s+="|\n|__|__|__|__|__|__|__|__|\n";
	}
	return s;
    }
    
    // get the piece at the indicated position
    this.get_piece = function(pos){
	var idx = get_index(pos);
	return this.board[idx[0]][idx[1]];
    }

    // Move a piece to a ceratain position
    this.move_piece = function(piece,pos){
	var idx2 = get_index(pos);
	var idx1 = piece.get_index();
	this.board[idx1[0]][idx1[1]] = null;
	this.board[idx2[0]][idx2[1]] = piece;
	piece.move_to(pos);
    }

    // Eat a piece
    this.eat_piece = function(piece1, piece2){
	var tmp;
	var idx1,idx2;
	idx1 = piece1.get_index();
	idx2 = piece2.get_index();
	if(piece2.color == "white"){
	    tmp = this.white_pieces.splice(this.white_pieces.indexOf(piece2),1);
	    this.white_eaten.push(tmp[0]);
	}
	else{
	    tmp = this.black_pieces.splice(this.black_pieces.indexOf(piece2),1);
	    this.black_eaten.push(tmp[0]);
	}
	this.board[idx1[0]][idx1[1]] = null;
	this.board[idx2[0]][idx2[1]] = piece1;
	piece1.move_to(piece2.get_position());
    }
    // Get pieces in an interval
    this.get_pieces = function(idx1,idx2){
	var out = [];
	var dx = idx2[0] - idx1[0];
	var dy = idx2[1] - idx1[1];
	var i,j;
	dx = dx>0?1:dx<0?-1:0;
	dy = dy>0?1:dy<0?-1:0;
	i = idx1[0] + dx;
	j = idx1[1] + dy;
	while(i!=idx2[0] || j!=idx2[1]){
	    if(this.board[i][j]!=null)
		out.push(this.board[i][j]);
	    i += dx;
	    j += dy;
	}
	return out;
    }
    // Decide if we can move the specified piece
    this.can_move_to = function(piece,pos){
	var idx1,idx2;
	idx1 = piece.get_index();
	idx2 = get_index(pos);
	if(piece.can_move_to(pos)){
	    if(piece.piece_type == "rook" || piece.piece_type == "bishop" || piece.piece_type == "queen" || piece.piece_type == "pawn"){
		if(this.get_pieces(idx1,idx2).length)
		    return false;
		else
		    return true;
	    }
	    else
		return true;
	}
	else
	    return false;
	return true;
    }
    // Move a piece
    this.move = function(pos1,pos2){
	var piece1 = this.get_piece(pos1);
	var piece2 = this.get_piece(pos2);
	this.selected = "";
	if(piece1){
	    if(piece2){
		piece1.set_state("attack");
		if(this.can_move_to(piece1,pos2)){
		    if(piece1.color != piece2.color)
			this.eat_piece(piece1,piece2);
		    else{
			piece1.set_state("normal");
			return MOVE_NOT_ALLOWED;
		    }
		}
		else{
		    piece1.set_state("normal");
		    return MOVE_NOT_ALLOWED;
		}
	    }
	    else{
		if(this.can_move_to(piece1,pos2))
		    this.move_piece(piece1,pos2);
		else
		    return MOVE_NOT_ALLOWED;
	    }
	}
	else
	    return NO_PIECE;
	return SUCCESS;
    }
    this.draw_board = function(ctx,dim){
	var h = dim/8;
	ctx.save();
	for(var i = 0;i<8;i++){
	    for(var j = 0;j<8;j++){
		ctx.beginPath();
		ctx.fillStyle = (i+j+1)%2?"#FFFFFF":"#D2691E";
		ctx.rect(i*h,j*h,h,h);
		ctx.fill();
		ctx.closePath();
	    }
	}
	ctx.restore();
    }
    this.select_square = function(x,y,dim){
	var h = dim/8;
	this.selected = String.fromCharCode(Math.floor(x/h) + 97) + String.fromCharCode(8 - Math.floor(y/h) + 48);
    }
    this.draw_pieces = function(ctx,dim){
	for(var i = 0;i<this.black_pieces.length;i++)
	    this.black_pieces[i].draw(ctx,dim);
	for(var i = 0;i<this.white_pieces.length;i++)
	    this.white_pieces[i].draw(ctx,dim);
    }
    this.draw_selected = function(ctx,dim){
	var idx;
	var h = dim/8;
	if(this.selected != ""){
	    idx = get_index(this.selected);
	    ctx.save();
	    ctx.globalAlpha = 0.3;
	    ctx.fillStyle = "#FF0000";
	    ctx.rect(idx[1]*h,idx[0]*h,h,h);
	    ctx.fill();
	    ctx.restore();
	}
    }
    this.clear = function(ctx,dim){
	ctx.save();
	ctx.fillStyle = "#FFFFFF";
	ctx.rect(0,0,dim,dim);
	ctx.fill();
	ctx.restore();
    }
    this.draw = function(ctx,dim){
	this.clear(ctx,dim);
	this.draw_board(ctx,dim);
	this.draw_pieces(ctx,dim);
	this.draw_selected(ctx,dim);
    }
}
